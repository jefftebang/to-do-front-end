import Profile from "./components/profile/profile.component";
import ToDos from "./components/to-dos/to-dos.component";

const App = () => {
  return (
    <div className="flex justify-center items-center 5xs:py-5 py-10">
      <div className="container flex flex-col justify-center bg-white rounded-lg shadow-md drop-shadow-lg px-20 py-10 5xs:py-5 5xs:px-4 5xs:max-w-[280px] 4xs:max-w-[350px] 3xs:max-w-[410px] 2xs:max-w-[470px] xs:max-w-[540px] sm:max-w-[600px] md:max-w-[725px] lg:max-w-[768px]">
        <Profile />
        <ToDos />
      </div>
    </div>
  );
};

export default App;
