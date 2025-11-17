const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-primary p-6">
      <h2 className="text-2xl font-bold mb-4">404</h2>
      <p className="text-secondary mb-4">Página no encontrada</p>
      <a
        href="/"
        className="button-primary"
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;