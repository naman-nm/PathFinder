const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("admin_token");
};

export const logout = () => {

  localStorage.removeItem("admin_token");

  window.location.href = "/admin";

};

const getHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


const handleResponse = async (response: Response) => {

  if (response.status === 401) {
    logout();
    throw new Error("Session expired");
  }
  if (!response.ok) {
    throw new Error("API Error");
  }
  return response.json();
};

export const getResources = async () => {
  const response = await fetch(
    `${BASE_URL}/api/admin/resources/`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const data =
    await handleResponse(response);
  return data.results || data;
};

export const getResourcesWithJWT = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/get/resources/`
      , {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch resources");
    }

    const data = await response.json();

    // if pagination exists
    return data.results || data;

  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};


export const deleteResource = async (id: number) => {
  const token = getAuthToken();
  const response = await fetch(
    `${BASE_URL}/api/admin/resources/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await handleResponse(response);
};

export const createResource = async (data:any) => {

  const token = getAuthToken();
  const res = await fetch(
    `${BASE_URL}/api/admin/resources/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse(res);

};

export const updateResource = async (id: number, data: any) => {
  const token = getAuthToken();
  const res = await fetch(
    `${BASE_URL}/api/admin/resources/${id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  return handleResponse(res);
};
