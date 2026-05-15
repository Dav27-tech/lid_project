const news_letter_Form = document.getElementById("newsletter-form");

const setSubmitState = (button, isSending) => {
  if (!button) return;
  button.disabled = isSending;
  button.innerHTML = isSending ? "..." : '<i class="fas fa-paper-plane"></i>';
};

news_letter_Form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const endpoint = news_letter_Form.getAttribute("action");
  const submitButton = news_letter_Form.querySelector('button[type="submit"]');
  const formData = new FormData(news_letter_Form);

  if (!endpoint || endpoint.includes("REMPLACE_PAR")) {
    alert("Ajoutez d'abord votre identifiant");
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
      news_letter_Form.reset();
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
