import { Link } from 'react-router-dom';
import { Headset, Ticket, Clock, FileBarChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Top Nav ── */}
      <nav className="flex items-center justify-between px-9 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-nexdark flex items-center justify-center">
            <Headset size={15} className="text-nexaccent" />
          </div>

          <span className="font-medium text-nextext">NexDesk</span>

          <span className="bg-gray-100 text-nexaccent text-[10px] px-2 py-0.5 rounded font-medium ml-1">
            by Copy Cat Group
          </span>
        </div>

        <div className="flex items-center gap-7">
          <a
            href="#how-it-works"
            className="text-sm text-nexmuted"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-nexmuted"
          >
            How it works
          </a>

          <Link
            to="/login"
            className="bg-nexdark text-white text-sm font-medium px-5 py-2 rounded-md"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="text-center py-16 px-9"
        style={{
          background:
            'linear-gradient(180deg, #F5F8FA 0%, #FFFFFF 100%)',
        }}
      >
        <span className="bg-gray-100 text-nexaccent text-xs px-3.5 py-1 rounded-full font-medium">
          Internal IT service desk
        </span>

        <h1 className="text-[34px] font-medium text-nextext mt-5 mb-3.5 leading-tight">
          One desk for every
          <br />
          support request
        </h1>

        <p className="text-nexmuted max-w-md mx-auto mb-8 leading-relaxed">
          Log incidents, track SLAs, and get help from the Copy Cat support
          team across Kenya, Tanzania, Uganda and Rwanda.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/login"
            className="bg-nexdark text-white px-6 py-2.5 rounded-md text-sm font-medium"
          >
            Sign in to NexDesk
          </Link>

          <a
            href="#how-it-works"
            className="bg-white text-nextext border border-gray-300 px-6 py-2.5 rounded-md text-sm font-medium"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section
        id="how-it-works"
        className="px-9 py-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
      >
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3.5">
            <Ticket size={18} className="text-nexaccent" />
          </div>

          <p className="font-medium text-nextext mb-1.5">
            Log a ticket in seconds
          </p>

          <p className="text-sm text-nexmuted leading-relaxed">
            Incidents, service requests, change requests or scheduled work —
            all from one form.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#F1E4DF] flex items-center justify-center mb-3.5">
            <Clock size={18} className="text-[#7A4A38]" />
          </div>

          <p className="font-medium text-nextext mb-1.5">
            SLA tracked automatically
          </p>

          <p className="text-sm text-nexmuted leading-relaxed">
            Every critical, major and minor incident has a clock running —
            so nothing slips through.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#E6EBE6] flex items-center justify-center mb-3.5">
            <FileBarChart size={18} className="text-[#54705A]" />
          </div>

          <p className="font-medium text-nextext mb-1.5">
            Reports on demand
          </p>

          <p className="text-sm text-nexmuted leading-relaxed">
            Export ticket history and SLA compliance as PDF or Excel whenever
            you need it.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-9 py-4 flex justify-between text-xs text-gray-400">
        <span>© 2026 Copy Cat Group</span>
        <span>support@copycatgroup.com</span>
      </footer>
    </div>
  );
};

export default Landing;