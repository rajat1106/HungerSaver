/* 
    When asking a user to donate food, we ask in the details of the food and add the food item
    to out list of donations (Donateion table). We also link the user to the donation they have made.
*/
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface FormData {
  name: string;
  expiry: string;
  quantity: string;
  address: string;
  contact: string;
  foodType: string;
}

const Donate = () => {
  const router = useRouter();
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, data, isLoading } = trpc.user.newDonation.useMutation();


  const onSubmit: SubmitHandler<FieldValues | FormData> = (input) => {
    console.log(input);

    mutate({
      name: input.name,
      expiry: new Date(input.expiry),
      contact: input.contact,
      address: input.address,
      foodType: input.foodType,
      quantity: input.quantity,
    });

  };

  if (data) {
    router.reload();
  }

  useEffect(() => {

    if (!session.data?.user) {
      router.push("/");
    }
  }, [])

  if (isLoading) {
    return (
      <p className="text-6xl">Loading...</p>
    )
  }

  return (
    <>
      <p className="text-4xl ">Donate Food</p>
      <div className="w-full flex justify-center items-center">
        <form className="flex flex-col w-4/6 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full max-w-xs my-2"
            {...register("name")}
          />
          <input
            className="input input-bordered w-full max-w-xs my-2"
            type="date"
            {...register("expiry")}
          />
          <input
            type="text"
            placeholder="Quantity"
            className="input input-bordered w-full max-w-xs my-2"
            {...register("quantity")}
          />
          <input
            type="text"
            placeholder="Address"
            className="input input-bordered w-full max-w-xs my-2"
            {...register("address")}
          />
          <input
            type="text"
            placeholder="Contact"
            className="input input-bordered w-full max-w-xs my-2"
            {...register("contact")}
          />
          <select className="select select-bordered w-full max-w-xs my-2" {...register("foodType")}>
            <option disabled selected>Food Type</option>
            <option value="VEG">Veg</option>
            <option value="NON_VEG">Non Veg</option>
          </select>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Donate;
