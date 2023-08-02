import Profile from "./components/profile/profile.component";
import ToDos from "./components/to-dos/to-dos.component";

const App = () => {
  return (
    <div className="flex justify-center items-center 5xs:py-5 py-10">
      <div className="container flex flex-col justify-center bg-white rounded-lg shadow-md drop-shadow-lg px-20 py-10 5xs:py-5 5xs:px-4 5xs:w-[280px] max-w-[768px]">
        <Profile />
        <ToDos />
      </div>
    </div>
  );
};

export default App;
