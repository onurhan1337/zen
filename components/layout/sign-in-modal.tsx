import {Dispatch, SetStateAction, useCallback, useMemo, useState,} from "react";
import Image from "next/image";
import {signIn} from "next-auth/react";
import Modal from "@/components/shared/modal";
import {Github, Google, LoadingDots} from "@/components/shared/icons";

const SignInModal = ({
                         showSignInModal,
                         setShowSignInModal,
                     }: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [signInClicked, setSignInClicked] = useState(false);

    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-zinc-600">
                <div
                    className="flex flex-col items-center justify-center space-y-3 border-b border-zinc-600 bg-zinc-900 px-4 py-6 pt-8 text-center md:px-16">
                    <a>
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            className="rounded-full"
                            width={64}
                            height={64}
                        />
                    </a>
                    <h3 className="font-display text-2xl font-bold">Sign In</h3>
                    <p className="text-sm text-zinc-400">
                        This is strictly for demo purposes - only your email and profile
                        picture will be stored.
                    </p>
                </div>

                <div className="flex flex-col space-y-4 bg-zinc-900 px-4 py-8 md:px-16">
                    <button
                        disabled={signInClicked}
                        className={`${
                            signInClicked
                                ? "cursor-not-allowed border-zinc-700 bg-zinc-800"
                                : "border border-zinc-600 bg-zinc-950/30 text-zinc-300 hover:bg-zinc-900"
                        } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                        onClick={() => {
                            setSignInClicked(true);
                            signIn("google");
                        }}
                    >
                        {signInClicked ? (
                            <LoadingDots color="#808080"/>
                        ) : (
                            <>
                                <Google className="h-5 w-5"/>
                                <p>Sign In with Google</p>
                            </>
                        )}
                    </button>
                    <button
                        disabled={signInClicked}
                        className={`${
                            signInClicked
                                ? "cursor-not-allowed border-zinc-700 bg-zinc-800"
                                : "border border-zinc-600 bg-zinc-950/30 text-zinc-300 hover:bg-zinc-900"
                        } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                        onClick={() => {
                            setSignInClicked(true);
                            signIn("github");
                        }}
                    >
                        {signInClicked ? (
                            <LoadingDots color="#808080"/>
                        ) : (
                            <>
                                <Github className="h-5 w-5"/>
                                <p>Sign In with Github</p>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export function useSignInModal() {
    const [showSignInModal, setShowSignInModal] = useState(false);

    const SignInModalCallback = useCallback(() => {
        return (
            <SignInModal
                showSignInModal={showSignInModal}
                setShowSignInModal={setShowSignInModal}
            />
        );
    }, [showSignInModal, setShowSignInModal]);

    return useMemo(
        () => ({setShowSignInModal, SignInModal: SignInModalCallback}),
        [setShowSignInModal, SignInModalCallback],
    );
}
