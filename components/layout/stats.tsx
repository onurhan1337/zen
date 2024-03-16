import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { cn } from "@/lib/utils";

interface Data {
  projects: {
    total: number;
    recent: number;
  };
  tasks: {
    total: number;
    recent: number;
  };
  users: number;
}

export default function Stats() {
  const { data } = useSWR<Data>("/api/stats", fetcher, {
    refreshInterval: 1000,
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-zinc-300">Loading...</p>
      </div>
    );
  }

  const stats = Object.entries(data).map(([key, value]) => {
    if (key === "users") {
      return {
        name: key,
        total: value,
      };
    } else {
      const change = Math.abs(value.total - value.recent);
      const percentageChange = Math.round((change / value.total) * 100);
      return {
        name: key,
        total: value.total,
        recent: value.recent,
        change: `${change} (${percentageChange}%)`,
        changeType: value.total < value.recent ? "decrease" : "increase",
      };
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h3 className="text-base font-semibold leading-6 text-zinc-300">
        Last 30 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((item) => (
          <StatItem
            key={item.name}
            title={item.name}
            total={item.total}
            recent={item.recent}
            change={item.change}
            changeType={item.changeType}
          />
        ))}
      </dl>
    </div>
  );
}

const StatItem = ({
  title,
  total,
  recent,
  change,
  changeType,
}: {
  title: string;
  total: number;
  recent: number;
  change: string | undefined;
  changeType: string | undefined;
}) => (
  <div className="border-zinc-200 px-4 py-5 sm:p-6">
    <dt className="text-lg font-normal text-zinc-300">{title}</dt>
    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
      {title === "users" ? (
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-green-600">{total}</span>
          <span className="ml-2 text-sm font-medium text-zinc-400">Total</span>
        </div>
      ) : (
        <div className="flex items-baseline text-2xl font-semibold text-green-600">
          {total}
          <span className="ml-2 text-sm font-medium text-zinc-400">
            from {recent}
          </span>
        </div>
      )}

      {title !== "users" && (
        <ChangeIndicator change={change} changeType={changeType} />
      )}
    </dd>
  </div>
);

const ChangeIndicator = ({
  change,
  changeType,
}: {
  change: string | undefined;
  changeType: string | undefined;
}) => (
  <div
    className={cn(
      changeType === "increase"
        ? "bg-green-950 text-green-300"
        : "bg-red-100 text-red-800",
      "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0",
    )}
  >
    {changeType === "increase" ? (
      <ArrowUpIcon className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500" />
    ) : (
      <ArrowDownIcon className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500" />
    )}
    <span className="sr-only">
      {changeType === "increase" ? "Increased" : "Decreased"} by{" "}
    </span>
    {change}
  </div>
);
