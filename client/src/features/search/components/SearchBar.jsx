import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  // form submission
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const searchInput = form.querySelector("#search");
    const searchText = searchInput.value.trim();

    // return if empty search
    if (searchText === "") {
      return;
    }

    navigate(`/skills?search=${encodeURIComponent(searchText)}`);
  }

  return (
    <form onSubmit={handleSubmit}>
        <input 
            id="search"
            className="border 1px black rounded-full px-2 font-normal h-fit"
            type="search" 
            name="search" 
            placeholder="Search..." 
        />
    </form>
  );
}

export default SearchBar;