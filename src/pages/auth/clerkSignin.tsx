import { SignIn } from "@clerk/react";

export default function ClerkSignin() {
  return (
    <div className="w-full h-auto flex justify-center items-center bg-[#f8f6fc] pb-8">
      <SignIn
        oauthFlow="popup"
        appearance={{ theme: "shadcn" }}
        signUpUrl="/auth/register"
      />
    </div>
  );
}
