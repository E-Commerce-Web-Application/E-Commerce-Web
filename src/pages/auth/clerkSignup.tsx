import { SignUp } from "@clerk/react";

export default function ClerkSignup() {
  return (
    <div className="w-full h-auto flex justify-center items-center bg-[#f8f6fc] pb-8">
      <SignUp
        oauthFlow="popup"
        appearance={{ theme: "shadcn" }}
        signInUrl="/auth/login"
      />
    </div>
  );
}
