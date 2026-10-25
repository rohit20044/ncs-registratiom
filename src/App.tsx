import { Navbar } from './components/Navbar.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <RegistrationForm />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500">
          <span>NCS Registration</span>
        </div>
      </footer>
    </div>
  );
}
