const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getModules = async () => {
  const response = await fetch(`${BACKEND_URL}/api/v1/modules`);
  const res = await response.json();

  return res;
};
export const getFormEntries = async () => {
  const response = await fetch(`${BACKEND_URL}/api/v1/form-entries`);
  const res = await response.json();
  return res;
};

export const getModuleById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/api/v1/modules/${id}`);
  const res = await response.json();

  return res;
};

export const createModules = async (data: any) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/modules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    return res;
  } catch (err) {
    throw new Error(err as string);
  }
};

export const updateModules = async (data: any) => {
  const moduleId = data._id;
  delete data._id;
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/modules/${moduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    return res;
  } catch (err) {
    throw new Error(err as string);
  }
};
