import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, MapPin, Briefcase, Sparkles, Activity } from 'lucide-react';

// Types
interface CityInfo {
  name: string;
  rent: number;
  food: number;
  transport: number;
  internet: number;
  lifestyle: number;
}

interface JobInfo {
  name: string;
  salary: number;
  yearlyIncrease: number;
}

interface LifestyleInfo {
  name: string;
  factor: number;
}

interface YearData {
  year: number;
  totalCost: number;
  salary: number;
  balance: number;
  rent: number;
  food: number;
  transport: number;
  internet: number;
  lifestyleExp: number;
}

// Data statis
const cityData: Record<string, CityInfo> = {
  jakarta: { name: 'Jakarta', rent: 3500000, food: 2500000, transport: 1000000, internet: 400000, lifestyle: 1500000 },
  bandung: { name: 'Bandung', rent: 2000000, food: 1800000, transport: 700000, internet: 350000, lifestyle: 1200000 },
  surabaya: { name: 'Surabaya', rent: 2200000, food: 2000000, transport: 800000, internet: 350000, lifestyle: 1300000 },
  yogyakarta: { name: 'Yogyakarta', rent: 1500000, food: 1500000, transport: 600000, internet: 300000, lifestyle: 1000000 },
  medan: { name: 'Medan', rent: 1800000, food: 1700000, transport: 700000, internet: 350000, lifestyle: 1100000 },
  bali: { name: 'Bali (Denpasar)', rent: 2500000, food: 2200000, transport: 900000, internet: 400000, lifestyle: 1800000 }
};

const jobData: Record<string, JobInfo> = {
  freshgrad: { name: 'Fresh Graduate', salary: 5000000, yearlyIncrease: 0.10 },
  it: { name: 'IT / Software Engineer', salary: 8000000, yearlyIncrease: 0.15 },
  marketing: { name: 'Marketing', salary: 6500000, yearlyIncrease: 0.12 },
  finance: { name: 'Finance / Accounting', salary: 7000000, yearlyIncrease: 0.12 },
  design: { name: 'Desain / Kreatif', salary: 6000000, yearlyIncrease: 0.10 },
  cs: { name: 'Customer Service', salary: 5500000, yearlyIncrease: 0.08 },
  engineering: { name: 'Engineering / Teknik', salary: 7500000, yearlyIncrease: 0.13 },
  teacher: { name: 'Guru / Tutor', salary: 5500000, yearlyIncrease: 0.08 }
};

const lifestyleFactors: Record<string, LifestyleInfo> = {
  hemat: { name: 'Hemat', factor: 0.8 },
  normal: { name: 'Normal', factor: 1.0 },
  mewah: { name: 'Mewah', factor: 1.4 }
};

const formatRupiah = (num: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export default function LivingCostSimulator() {
  const [city, setCity] = useState<string>('jakarta');
  const [job, setJob] = useState<string>('freshgrad');
  const [lifestyle, setLifestyle] = useState<string>('normal');
  const [inflation, setInflation] = useState<number>(5);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const simulationData = useMemo<YearData[]>(() => {
    const cityInfo = cityData[city];
    const jobInfo = jobData[job];
    const lifestyleFactor = lifestyleFactors[lifestyle].factor;
    const inflationRate = inflation / 100;

    const years: YearData[] = [];
    for (let year = 1; year <= 5; year++) {
      const rentCost = cityInfo.rent * Math.pow(1 + inflationRate, year - 1);
      const foodCost = cityInfo.food * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      const transportCost = cityInfo.transport * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      const internetCost = cityInfo.internet * Math.pow(1 + inflationRate, year - 1);
      const lifestyleCost = cityInfo.lifestyle * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      
      const totalCost = rentCost + foodCost + transportCost + internetCost + lifestyleCost;
      const salary = jobInfo.salary * Math.pow(1 + jobInfo.yearlyIncrease, year - 1);
      const balance = salary - totalCost;
      
      years.push({
        year,
        totalCost: Math.round(totalCost),
        salary: Math.round(salary),
        balance: Math.round(balance),
        rent: Math.round(rentCost),
        food: Math.round(foodCost),
        transport: Math.round(transportCost),
        internet: Math.round(internetCost),
        lifestyleExp: Math.round(lifestyleCost)
      });
    }
    return years;
  }, [city, job, lifestyle, inflation]);

  const firstPositiveYear = simulationData.find(y => y.balance > 0)?.year;
  const totalIncrease = ((simulationData[4].totalCost - simulationData[0].totalCost) / simulationData[0].totalCost * 100).toFixed(1);

  return (
    <div className="bg-[#020410] min-h-screen relative" style={{ fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Background blur effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Simulasi
            </span>
            <span className="text-white ml-3">Biaya Hidup</span>
          </h1>
          <p className="text-slate-400 text-lg font-light tracking-wide">
            Proyeksi finansial masa depanmu 1-5 tahun ke depan
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Input Form */}
        <div className="group/form relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-amber-500/50 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Kota */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300 group-hover:text-amber-400 transition-colors">
                  <MapPin size={18} />
                  Kota
                </label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-500/50"
                >
                  {Object.entries(cityData).map(([key, data]) => (
                    <option key={key} value={key} className="bg-slate-900">{data.name}</option>
                  ))}
                </select>
              </div>

              {/* Pekerjaan */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300 group-hover:text-blue-400 transition-colors">
                  <Briefcase size={18} />
                  Pekerjaan
                </label>
                <select 
                  value={job} 
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500/50"
                >
                  {Object.entries(jobData).map(([key, data]) => (
                    <option key={key} value={key} className="bg-slate-900">{data.name}</option>
                  ))}
                </select>
              </div>

              {/* Gaya Hidup */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300 group-hover:text-purple-400 transition-colors">
                  <Sparkles size={18} />
                  Gaya Hidup
                </label>
                <select 
                  value={lifestyle} 
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
                >
                  {Object.entries(lifestyleFactors).map(([key, data]) => (
                    <option key={key} value={key} className="bg-slate-900">{data.name}</option>
                  ))}
                </select>
              </div>

              {/* Inflasi */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300 group-hover:text-emerald-400 transition-colors">
                  <Activity size={18} />
                  Inflasi: {inflation}%
                </label>
                <input 
                  type="range" 
                  min="3" 
                  max="10" 
                  value={inflation}
                  onChange={(e) => setInflation(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{
                    background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${((inflation - 3) / 7) * 100}%, rgb(51 65 85 / 0.5) ${((inflation - 3) / 7) * 100}%, rgb(51 65 85 / 0.5) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>3%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div 
            className="group/card relative"
            onMouseEnter={() => setHoveredCard('status')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${firstPositiveYear ? 'from-emerald-500/30 to-teal-600/30' : 'from-red-500/30 to-rose-600/30'} rounded-3xl blur-2xl transition-all duration-700 ${hoveredCard === 'status' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-slate-950/90 backdrop-blur-xl border ${hoveredCard === 'status' ? (firstPositiveYear ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-slate-800/50'} rounded-2xl p-8 transition-all duration-500 h-full`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`${firstPositiveYear ? 'text-emerald-400' : 'text-red-400'} text-sm font-semibold uppercase tracking-wider`}>Status Finansial</span>
                {firstPositiveYear ? <CheckCircle className="text-emerald-400" size={24} /> : <AlertCircle className="text-red-400" size={24} />}
              </div>
              <p className="text-3xl font-black text-white">
                {firstPositiveYear ? `Surplus Tahun ${firstPositiveYear}` : 'Perlu Penyesuaian'}
              </p>
            </div>
          </div>

          <div 
            className="group/card relative"
            onMouseEnter={() => setHoveredCard('increase')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-3xl blur-2xl transition-all duration-700 ${hoveredCard === 'increase' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-slate-950/90 backdrop-blur-xl border ${hoveredCard === 'increase' ? 'border-blue-500/50' : 'border-slate-800/50'} rounded-2xl p-8 transition-all duration-500 h-full`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Kenaikan 5 Tahun</span>
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <p className="text-3xl font-black text-white">+{totalIncrease}%</p>
            </div>
          </div>

          <div 
            className="group/card relative"
            onMouseEnter={() => setHoveredCard('cost')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-3xl blur-2xl transition-all duration-700 ${hoveredCard === 'cost' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-slate-950/90 backdrop-blur-xl border ${hoveredCard === 'cost' ? 'border-purple-500/50' : 'border-slate-800/50'} rounded-2xl p-8 transition-all duration-500 h-full`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Biaya Tahun 1</span>
                <TrendingDown className="text-purple-400" size={24} />
              </div>
              <p className="text-3xl font-black text-white">{formatRupiah(simulationData[0].totalCost)}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="group/chart relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover/chart:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Proyeksi Gaji vs Biaya Hidup
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#94a3b8" 
                  label={{ value: 'Tahun', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(2, 4, 16, 0.95)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
                  }}
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="salary" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Gaji" 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#020410' }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalCost" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Biaya Hidup" 
                  dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#020410' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detail Table */}
        <div className="group/table relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-pink-600/20 rounded-3xl blur-2xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-amber-500/50 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Detail Proyeksi Per Tahun
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Tahun</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Gaji</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Sewa/Kos</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Makan</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Transport</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Internet</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Lifestyle</th>
                    <th className="pb-4 pr-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Total Biaya</th>
                    <th className="pb-4 text-slate-400 font-semibold text-sm uppercase tracking-wider">Sisa</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationData.map((data) => (
                    <tr key={data.year} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 pr-4 font-bold text-white">{data.year}</td>
                      <td className="py-4 pr-4 text-emerald-400 font-semibold">{formatRupiah(data.salary)}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatRupiah(data.rent)}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatRupiah(data.food)}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatRupiah(data.transport)}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatRupiah(data.internet)}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatRupiah(data.lifestyleExp)}</td>
                      <td className="py-4 pr-4 text-red-400 font-semibold">{formatRupiah(data.totalCost)}</td>
                      <td className={`py-4 font-bold ${data.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatRupiah(data.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rekomendasi */}
        <div className="group/rec relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-3xl blur-2xl opacity-0 group-hover/rec:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
              Rekomendasi
            </h3>
            {simulationData[0].balance < 0 ? (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Gaji awal Anda <span className="font-bold text-white">{formatRupiah(simulationData[0].salary)}</span> kurang dari biaya hidup <span className="font-bold text-white">{formatRupiah(simulationData[0].totalCost)}</span></span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Pertimbangkan untuk memilih gaya hidup <span className="font-bold text-amber-400">Hemat</span> atau cari pekerjaan dengan gaji lebih tinggi</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Kota alternatif dengan biaya lebih rendah: <span className="font-bold text-blue-400">Yogyakarta</span> atau <span className="font-bold text-blue-400">Medan</span></span>
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Selamat! Gaji Anda sudah cukup untuk menutupi biaya hidup sejak tahun pertama</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Surplus tahun 1: <span className="font-bold text-emerald-400">{formatRupiah(simulationData[0].balance)}</span></span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Pertimbangkan untuk menabung minimal 20% dari surplus untuk dana darurat</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Watermark */}
        <div className="text-center py-8 border-t border-slate-800/50">
          <p className="text-slate-500 text-sm font-light">
            Created with <span className="text-red-400">♥</span> by{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
              Hasan Fadhlurrahman
            </span>
          </p>
          <p className="text-slate-600 text-xs mt-2">
            © 2025 Living Cost Simulator • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}