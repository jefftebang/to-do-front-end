import Profile from "./components/profile/profile.component";
import ToDos from "./components/to-dos/to-dos.component";

const App = () => {
  return (
    <div className="flex">
      <Profile />
      <ToDos />
    </div>
  );
};

export default App;
