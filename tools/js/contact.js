const contactForm = document.getElementById("contact-form");

const setSubmitState = (button, isSending) => {
  if (!button) return;
  button.disabled = isSending;
  button.innerHTML = isSending
    ? "Envoi en cours..."
    : 'Envoyer la demande <i class="fa-solid fa-arrow-right"></i>';
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const endpoint = contactForm.getAttribute("action");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);

  if (!endpoint || endpoint.includes("REMPLACE_PAR")) {
    alert("Ajoutez d'abord votre identifiant Formspree dans Pages/contact.html.");
    return;
  }

  setSubmitState(submitButton, true);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      alert("Votre demande a été envoyée avec succès.");
      contactForm.reset();
      return;
    }

    const result = await response.json().catch(() => null);
    const message =
      result?.errors?.map((error) => error.message).join("\n") ||
      "Formspree a refusé l'envoi du message.";

    alert(message);
  } catch (error) {
    alert("Impossible d'envoyer le message. Vérifiez votre connexion.");
    console.error(error);
  } finally {
    setSubmitState(submitButton, false);
  }
});
