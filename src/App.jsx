import Profile from "./components/profile/profile.component";
import ToDos from "./components/to-dos/to-dos.component";

const App = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="container flex flex-col justify-center bg-white rounded-lg shadow-md drop-shadow-lg px-20 py-10">
        <Profile />
        <ToDos />
      </div>
    </div>
  );
};

export default App;
