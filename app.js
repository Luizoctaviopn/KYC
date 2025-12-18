const API_BASE_URL = localStorage.getItem("kyc_api_url") || "https://api.exemplo.com";

const form = document.getElementById("kyc-form");
const statusText = document.getElementById("status-text");
const statusRefresh = document.getElementById("status-refresh");
const toast = document.getElementById("toast");

function showToast(message, type = "info") {
  toast.textContent = message;
  toast.classList.toggle("visible", true);
  toast.style.borderColor = type === "error" ? "#f87171" : "var(--border)";
  setTimeout(() => toast.classList.remove("visible"), 2800);
}

async function submitKyc(event) {
  event.preventDefault();
  const formData = new FormData(form);

  if (!formData.get("consent")) {
    showToast("É necessário aceitar o termo de consentimento.", "error");
    return;
  }

  const payload = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    document: formData.get("document"),
    address: {
      zipcode: formData.get("zipcode"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}/kyc/applications`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: (() => {
        const multipart = new FormData();
        multipart.append("payload", JSON.stringify(payload));
        multipart.append("idDocument", formData.get("idDocument"));
        multipart.append("proofOfAddress", formData.get("proofOfAddress"));
        return multipart;
      })(),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar a aplicação para análise.");
    }

    const { status, protocol } = await response.json();
    statusText.textContent = `Protocolo ${protocol}: ${status}`;
    localStorage.setItem("last_protocol", protocol);
    showToast("Dados enviados com sucesso!", "success");
    form.reset();
  } catch (error) {
    console.error(error);
    showToast("Não foi possível enviar agora. Verifique a API ou tente novamente.", "error");
  }
}

async function fetchStatus() {
  const protocol = localStorage.getItem("last_protocol");
  if (!protocol) {
    showToast("Envie seus documentos para acompanhar o status.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/kyc/applications/${protocol}`);
    if (!response.ok) {
      throw new Error("Erro ao consultar status.");
    }

    const { status, reviewer, updatedAt } = await response.json();
    statusText.textContent = `Protocolo ${protocol}: ${status}`;
    const audit = [reviewer ? `Revisor: ${reviewer}` : null, updatedAt ? `Atualizado em ${new Date(updatedAt).toLocaleString("pt-BR")}` : null]
      .filter(Boolean)
      .join(" · ");
    if (audit) {
      statusText.textContent += ` (${audit})`;
    }
    showToast("Status atualizado");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível consultar o status agora.", "error");
  }
}

form.addEventListener("submit", submitKyc);
statusRefresh.addEventListener("click", fetchStatus);

showToast("Defina a URL da API no app.js para apontar para o ambiente correto.");
