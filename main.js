import './style.css';

const appRoot = document.querySelector('#app');
if (appRoot) {
  appRoot.innerHTML = `
    <div class="app-shell">
      <h1>ProjectSIS</h1>
      <p>Frontend bootstrapped successfully.</p>
    </div>
  `;
}
