const login = async (userInput) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userInput.username,
      password: userInput.password,
    }),
  }).catch((err) => {
    console.log(err);
  });
  const result = await response.json();
  return { result: result, ok: response.ok };
};

const requestPasswordReset = async (email) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/password-reset/request`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }
  );

  const result = await response.json();
  return result;
};

module.exports = { login, requestPasswordReset };
