'use client';

const Error = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-primary p-6">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal!</h2>
      <p className="text-secondary mb-4">{error?.message || 'Ocurrió un error'}</p>
      <button
        onClick={() => reset()}
        className="button-primary"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};

export default Error;