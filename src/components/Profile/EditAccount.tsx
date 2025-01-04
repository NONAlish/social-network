import BirthdayPicker from "./BirthdayPicker";


interface Birthday {
  day: string;
  month: string;
  year: string;
}

interface Data {
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: Birthday;
  username: string;
}

const EditAccount: React.FC = () => {
  const data_obj: Data = {
    firstName: "Alisher",
    lastName: "Iliyev",
    gender: "Hello I'm Alisher and I'm 19 years old",
    birthday: {
      day: '13',
      month: 'august',
      year: '2005',
    },
    username: "iliyev13",
  };
  return (
    <div className="w-[500px] bg-ash-500 rounded-md">
      <div className="p-8">
        <div className="flex items-center">
          <div className="w-[100px] h-[100px] bg-ash-600 rounded-full">
            <img src="#" alt="#" />
          </div>
          <div className="ml-8 text-white">
            <p>Alisher Iliyev</p>
            <p className="text-xs font-extralight">ID: 57439857329</p>
          </div>
        </div>
        <div className="mt-8">
          <form action="">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col">
                <label htmlFor="firstname" className="text-ash-300">
                  First name
                </label>
                <input
                  type="text"
                  value={data_obj.firstName}
                  className="w-[200px] p-1 pl-4 rounded-md bg-ash-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="firstname" className="text-ash-300">
                  Last name
                </label>
                <input
                  type="text"
                  value={data_obj.lastName}
                  className="w-[200px] p-1 pl-4 rounded-md bg-ash-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="firstname" className="text-ash-300">
                  Gender
                </label>
                <input
                  type="text"
                  value={data_obj.lastName}
                  className="w-[200px] p-1 pl-4 rounded-md bg-ash-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <BirthdayPicker data={data_obj} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="firstname" className="text-ash-300">
                  Gender
                </label>
                <input
                  type="text"
                  value={data_obj.lastName}
                  className="w-[200px] p-1 pl-4 rounded-md bg-ash-700 text-white"
                />
              </div>
            </div>
            <button type="submit" className="mt-6 h-8 w-24 rounded-md bg-ash-200 text-ash-700">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
