import { FileDown, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/axios';

const AdminReports = () => {
    const [slaData, setSlaData] = useState(null);
    const [loading, setLoading] = useState(false);

    const downloadReport = async (type) => {
        try{
            const response = await api.get(`/reports/tickets/${type}`, {
                responseType: 'blob'    // tells axios "expect binary data, not JSON"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-report.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch(err){
            alert('Failed to download report');
        }
    };

    const fetchSLAReport = async () => {
        setLoading(true);
        try{
            const res = await api.get('/reports/sla');
            setSlaData(res.data);
        }catch(err){
            alert('Failed to load SLA report');
        }finally{
            setLoading(false);
        }
    };

    return (
         <div>
      <h1 className="text-lg font-medium text-nextext mb-5">Reports</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => downloadReport('pdf')}
          className="bg-white border border-gray-200 rounded-lg p-5 text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
            <FileDown size={18} className="text-nexaccent" />
          </div>
          <p className="font-medium text-nextext mb-1">Ticket report (PDF)</p>
          <p className="text-sm text-gray-400">Download all tickets as PDF</p>
        </button>

        <button
          onClick={() => downloadReport('excel')}
          className="bg-white border border-gray-200 rounded-lg p-5 text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-[#E6EBE6] flex items-center justify-center mb-3">
            <FileSpreadsheet size={18} className="text-[#54705A]" />
          </div>
          <p className="font-medium text-nextext mb-1">Ticket report (Excel)</p>
          <p className="text-sm text-gray-400">Download all tickets as Excel</p>
        </button>

        <button
          onClick={fetchSLAReport}
          className="bg-white border border-gray-200 rounded-lg p-5 text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F1E4DF] flex items-center justify-center mb-3">
            <BarChart3 size={18} className="text-[#7A4A38]" />
          </div>
          <p className="font-medium text-nextext mb-1">SLA compliance</p>
          <p className="text-sm text-gray-400">View SLA breach stats</p>
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {/* Only show this block once slaData has actually loaded */}
      {slaData && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-medium text-nextext mb-4">SLA compliance summary</p>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total support tickets</p>
              <p className="text-lg font-medium text-nextext">{slaData.totalSupportTickets}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">On time</p>
              <p className="text-lg font-medium text-[#54705A]">{slaData.onTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Breached</p>
              <p className="text-lg font-medium text-[#A4654E]">{slaData.breached}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Compliance rate</p>
              <p className="text-lg font-medium text-nextext">{slaData.complianceRate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default AdminReports;