import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { FaRegUserCircle } from "react-icons/fa";
import { TbLockPassword, TbEye, TbEyeClosed } from "react-icons/tb";

function Form() {

  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const { mutate:login, isError, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.post('/api/auth/login', formData);
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
      queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  })

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    login(formData);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent border">
        <FaRegUserCircle className="text-info" />
        <input type="text" className="grow text-xs" placeholder="Username" name="userName" />
      </label>
      <label className="input input-bordered rounded-none my-1.5 flex items-center gap-2 bg-accent">
        <TbLockPassword className="text-info" />
        <input type={visible?'text':'password'} className="grow text-xs" placeholder="Password" name="password" />
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
      <button type="submit" className="btn btn-sm btn-wide my-4 btn-neutral text-base-100">
        {isPending ? '•••': 'Login'}
      </button>
      {isError && <p className="max-w-64 text-center text-sm text-error font-bold">{error}</p>}
    </form>
  )

}

export default Form;