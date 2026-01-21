export async function logout() {
  await fetch("/api/logout", {
    method: "POST",
  });

  // redirect ke homepage
  window.location.href = "/";
}
