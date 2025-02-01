document.getElementById('calcBtn').addEventListener('click', calculatePlates);

function calculatePlates() {
  const target = parseFloat(document.getElementById("target").value);
  const bar = parseFloat(document.getElementById("bar").value);
  const plateResultDiv = document.getElementById("plateResult");
  plateResultDiv.innerHTML = ""; // Limpiar resultados previos

  // Validar entrada
  if (isNaN(target) || target <= 0) {
    plateResultDiv.innerHTML = "<p>Por favor, ingresa un peso objetivo válido.</p>";
    return;
  }
  if (target <= bar) {
    plateResultDiv.innerHTML = `<p>El peso objetivo debe ser mayor que el de la barra (${bar} kg).</p>`;
    return;
  }

  // Calcular el peso total a agregar con plates
  const totalPlateWeight = target - bar;

  // Si es exactamente alcanzable (en incrementos de 5kg)
  if (totalPlateWeight % 5 === 0) {
    const achievedTotal = target;
    const perSide = totalPlateWeight / 2;
    const distribution = getDistribution(perSide);
    let html = `<h3>Peso exacto alcanzado: ${achievedTotal} kg</h3>`;
    html += generateOptionHTML("Exacto", achievedTotal, target, distribution);
    plateResultDiv.innerHTML = html;
  } else {
    // Si no es exacto, se calculan las dos opciones (menor y mayor)
    const lowerPlateWeight = 5 * Math.floor(totalPlateWeight / 5);
    const higherPlateWeight = 5 * Math.ceil(totalPlateWeight / 5);
    const lowerAchieved = bar + lowerPlateWeight;
    const higherAchieved = bar + higherPlateWeight;
    const lowerDiff = (target - lowerAchieved).toFixed(1);
    const higherDiff = (higherAchieved - target).toFixed(1);

    let html = `<h3>No se alcanzó el peso exacto solicitado.</h3>`;
    html += `<p>El peso solicitado es ${target} kg.</p>`;
    html += `<div class="option-container">`;
    html += generateOptionHTML("Menor", lowerAchieved, target, getDistribution(lowerPlateWeight / 2), lowerDiff);
    html += generateOptionHTML("Mayor", higherAchieved, target, getDistribution(higherPlateWeight / 2), higherDiff);
    html += `</div>`;
    plateResultDiv.innerHTML = html;
  }
}

// Función que calcula la distribución de plates por lado dado un peso por lado (debe ser múltiplo de 2.5)
function getDistribution(perSide) {
  const plateSizes = [20, 10, 5, 2.5];
  let distribution = {};
  let remaining = perSide;
  plateSizes.forEach(plate => {
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      distribution[plate] = count;
      remaining -= count * plate;
    }
  });
  return distribution;
}

// Función para generar el HTML de cada opción (exacta, menor o mayor)
// diff: diferencia (en kg) entre el peso alcanzado y el solicitado (si aplica)
function generateOptionHTML(title, achievedTotal, target, distribution, diff = 0) {
  let html = `<div class="option">`;
  html += `<h4>Opción ${title} (Peso alcanzado: ${achievedTotal} kg`;
  if (diff != 0) {
    html += `, diferencia: ${diff} kg`;
  }
  html += `)</h4>`;
  html += `<div class="plate-result">`;
  // Actualización de rutas: usa la carpeta "image" en lugar de "images"
  const plateImages = {
    "20": "image/20kg.png",
    "10": "image/10kg.png",
    "5": "image/5kg.png",
    "2.5": "image/2punto5kg.png"
  };
  // Mostrar en orden descendente
  [20, 10, 5, 2.5].forEach(plate => {
    if (distribution[plate]) {
      const count = distribution[plate];
      html += `<div class="plate-card">`;
      html += `<img src="${plateImages[plate.toString()]}" alt="${plate} kg">`;
      html += `<span>${count} x ${plate} kg</span>`;
      html += `</div>`;
    }
  });
  html += `</div>`; // Cerrar contenedor de plates
  html += `</div>`; // Cerrar opción
  return html;
}
