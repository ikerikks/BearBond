import { Link } from "react-router-dom";

import { RiBearSmileFill } from "react-icons/ri";

import Form from "./Form";


function SignUpPage() {

  return (
    <main className="h-full w-full flex justify-center">
      <section className="flex-col">
        <div className="flex items-center py-6 mt-12">
          <RiBearSmileFill className="text-6xl text-[#e91c51]" />
          <h1 className="text-3xl font-bold mt-3 text-black">BearBond</h1>
        </div>
        <Form />
        <div className="flex items-center gap-2 mt-4 border p-3 bg-gray-50 rounded-xl">
          <p className="text-sm">Have an account ?</p>
          <Link to="/login" className="link text-[#e91c51] text-sm font-bold no-underline">Login</Link>
        </div>
      </section>
    </main>
    // <p>HEELO MY FRIENDS</p>
  )
}


export default SignUpPage;