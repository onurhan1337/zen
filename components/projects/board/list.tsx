import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useState } from "react";

import { findBoardSectionContainer, initializeBoard } from "@/lib/utils/board";
import { getTaskById } from "@/lib/utils/tasks";
import { BoardSectionsType, Task, TaskStatusType } from "types/task";
import BoardSection from "./section";
import TaskItem from "./taskItem";

const BoardSectionList = ({ INITIAL_TASKS }: { INITIAL_TASKS: Task[] }) => {
  const tasks = INITIAL_TASKS;
  const [boardSections, setBoardSections] = useState<BoardSectionsType>({});

  React.useEffect(() => {
    const initialBoardSections = initializeBoard(tasks);
    setBoardSections(initialBoardSections);
  }, [INITIAL_TASKS, tasks]);

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string,
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string,
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id,
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id,
          ),
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          boardSections[activeContainer][activeIndex],
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length,
          ),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string,
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string,
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id,
    );
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id,
    );

    if (activeIndex !== overIndex) {
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex,
        ),
      }));
    }

    const activeTask = tasks.find((task) => task.id === active.id);

    if (activeTask) {
      activeTask.status = overContainer as TaskStatusType;

      fetch(`/api/task/${activeTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activeTask),
      });
    }

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <div className="my-4 grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-4">
      <DndContext
        id="unique-context"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(boardSections).map((boardSectionKey) => (
          <div key={boardSectionKey} className="col-span-1">
            <BoardSection
              id={boardSectionKey}
              title={boardSectionKey}
              tasks={boardSections[boardSectionKey] as any}
            />
          </div>
        ))}
        <DragOverlay dropAnimation={dropAnimation}>
          {task ? <TaskItem task={task} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BoardSectionList;

