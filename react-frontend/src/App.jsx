import { FormEvent, useState } from "react";

import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    creditHistory: "",
    married: "",
    coapplicantincome: "",
  });
  const [result, setResult] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const features = {
      features: [
        Number(formData.creditHistory),
        formData.married === "Married" ? 1 : 0,
        Number(formData.coapplicantincome),
      ],
    };

    try {
      const response = await fetch(
        "https://credit-risk-mmyr.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(features),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Prediction result:", result);
      setResult(result.prediction);
      // Handle result, e.g., display it to the user
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error, e.g., show error message to the user
    }
  };

  return (
    <div>
      <div className="max-w-lg mx-auto p-4 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Customer Details Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Credit history :</label>
            <input
              type="number"
              name="creditHistory"
              value={formData.creditHistory}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Married :</label>
            <div className="flex space-x-4 mt-1">
              {["M", "U"].map((married) => (
                <label key={married} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="married"
                    value={married}
                    checked={formData.married === married}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>{married === "M" ? "Married" : "Unmarried"}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Coapplicant income:</label>
            <input
              type="number"
              name="coapplicantincome"
              value={formData.coapplicantincome}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <h2 className="">result is {result}</h2>
      </div>
    </div>
  );
}

export default App;
