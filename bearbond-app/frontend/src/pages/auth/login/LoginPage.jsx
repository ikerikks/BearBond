import { Link } from "react-router-dom";

import { RiBearSmileFill } from "react-icons/ri";

import Form from "./Form";

function LoginPage() {

  return (
    <main className="flex h-full w-full justify-center bg-base-100">
      <section className="flex-col">
        <div className="flex items-center py-6 mt-12">
          <RiBearSmileFill className="text-6xl text-[#e91c51]" />
          <h1 className="text-3xl font-bold mt-3 text-black">BearBond</h1>
        </div>
        <Form />
        <div className="flex items-center py-2">
          <div className="h-px w-full bg-neutral opacity-35"></div>
          <p className="px-2 font-bold">OR</p>
          <div className="h-px w-full bg-neutral opacity-35"></div>
        </div>
        <button type="submit" className="btn btn-xs btn-wide btn-neutral text-base-100">Forgot password?</button>
        <div className="mt-5">
          <p className="text-lg text-neutral font-extrabold">Join today.</p>
          <div className="flex justify-center items-center gap-2 border p-3 rounded-xl bg-accent">
            <p className="text-sm">Don't have an account ?</p>
            <Link to="/signup" className="link text-[#e91c51] text-sm font-bold no-underline">Sign up</Link>
          </div>
        </div>

      </section>
    </main>
  )

}

export default LoginPage;