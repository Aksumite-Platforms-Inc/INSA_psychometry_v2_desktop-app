import { Link } from 'react-router-dom';

// unauthorized page with login again button
function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="text-lg mb-4">
        You are not authorized to view this page. Please login again.
      </p>
      <Link to="/login">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login Again
        </button>
      </Link>
    </div>
  );
}

export default Unauthorized;
