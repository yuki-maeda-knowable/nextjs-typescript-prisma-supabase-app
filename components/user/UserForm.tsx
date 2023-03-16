import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';

export type Inputs = {
  name: String;
  email: String;
}

export default function UserForm() {
  const router = useRouter()
  const { register, handleSubmit, watch, resetField, formState: {errors} } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: ''
    }
  })
  // const  userName = watch("name")
  // const  userEmail = watch("email")  

  const  SubmitUserRegister = async (input: Inputs) =>{
    const formData = {
      name: input.name,
      email: input.email
    }

    const res = await fetch('/api/user',
    {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // json形式で返す
    const data = await res.json()
    //フォーム初期化
    resetField("name")
    resetField("email")
    console.log(data);
    
    // ユーザ一覧にリダイレクト
    router.push('/users')
  }

    return (
    <div>
      <h3>ユーザー登録</h3>
      <form onSubmit={handleSubmit(SubmitUserRegister)}>
        <input {...register("name" ,{ required: '入力必須だよ' })} placeholder="name"/>
        <p>{errors.name?.message}</p>
        <br />
        <input {...register("email", { required: '入力必須だよ'})} placeholder="email" type="email"/>
        <p>{errors.email?.message}</p>
        <br />
        <input type="submit"/>
      </form>
      <hr />
    </div>
  )
}
