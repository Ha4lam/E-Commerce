const BASE_URL = "https://dummyjson.com/";

export async function fetchData(endpoint, onSuccess, onFailure, toggleLoading) {
  try {
    toggleLoading(true);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (response.ok) {
      const data = await response.json();
      onSuccess(data);
    } else {
      throw new Error("Error fetching data from the server");
    }
  } catch (error) {
    onFailure(error.message);
  } finally {
    toggleLoading(false);
  }
}

export async function postData(endpoint, data, onSuccess, onFailure, toggleLoading) {
  try {
    toggleLoading(true);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const result = await response.json();
      onSuccess(result);
    } else {
      throw new Error("Error posting data to the server");
    }
  } catch (error) {
    onFailure(error.message);
  } finally {
    toggleLoading(false);
  }
}
