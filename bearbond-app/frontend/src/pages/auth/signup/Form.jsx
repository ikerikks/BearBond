import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { FaRegUserCircle } from "react-icons/fa";
import { TbLockPassword, TbEye, TbEyeClosed } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";

function Form() {

  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const { mutate: signup, isError, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.post('/api/auth/signup', formData);
        const {data} = response;
        
        if (data.error) { throw data.error }
        return data;

      } catch (err) {
        if (err.response) {
          throw err.response.data.error;
        } else {
          throw err.message;
        }
      }
    },
    onSuccess: () => {
      toast.success('account created');
      navigate('/login');
    }
  })

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    signup(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-primary h-4 font-bold">*</p>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent">
        <MdAlternateEmail className="text-info" />
        <input type="email" required className="grow text-xs" placeholder="Email" name="email" />
      </label>
      <p className="text-primary h-4 font-bold">*</p>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent">
        <TbLockPassword className="text-info" />
        <input type={visible ? 'text' : 'password'} className="grow text-xs" placeholder="Password" name="password" />
        <button onClick={(ev)=>{
          ev.preventDefault();
          setVisible(!visible);
        }}>
          {visible 
            ? <TbEyeClosed className="text-xl text-info" />
            : <TbEye className="text-xl text-info" />
          }
        </button>
      </label>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent">
        <input type="text" className="grow text-xs" placeholder="Full Name" name="fullName" />
      </label>
      <p className="text-primary h-4 font-bold">*</p>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent">
        <FaRegUserCircle className="text-info" />
        <input type="text" className="grow text-xs" placeholder="Username" name="userName" />
      </label>
      <button type="submit" className="btn btn-sm btn-wide my-4 btn-neutral text-base-100">
        {isPending? '•••': 'Sign up'}
      </button>
      {isError && <p className="max-w-64 text-center text-sm text-error font-bold">{error}</p>}
    </form>
  )

}

export default Form;