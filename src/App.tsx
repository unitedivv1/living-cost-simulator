import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

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

  const simulationData = useMemo<YearData[]>(() => {
    const cityInfo = cityData[city];
    const jobInfo = jobData[job];
    const lifestyleFactor = lifestyleFactors[lifestyle].factor;
    const inflationRate = inflation / 100;

    const years: YearData[] = [];
    for (let year = 1; year <= 5; year++) {
      // Hitung biaya dengan inflasi
      const rentCost = cityInfo.rent * Math.pow(1 + inflationRate, year - 1);
      const foodCost = cityInfo.food * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      const transportCost = cityInfo.transport * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      const internetCost = cityInfo.internet * Math.pow(1 + inflationRate, year - 1);
      const lifestyleCost = cityInfo.lifestyle * lifestyleFactor * Math.pow(1 + inflationRate, year - 1);
      
      const totalCost = rentCost + foodCost + transportCost + internetCost + lifestyleCost;
      
      // Hitung gaji dengan kenaikan tahunan
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simulasi Biaya Hidup Masa Depan
          </h1>
          <p className="text-gray-300 text-lg">Hitung proyeksi biaya hidupmu 1-5 tahun ke depan</p>
        </div>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kota */}
            <div>
              <label className="block text-sm font-medium mb-2">🏙️ Kota</label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(cityData).map(([key, data]) => (
                  <option key={key} value={key} className="bg-slate-800">{data.name}</option>
                ))}
              </select>
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="block text-sm font-medium mb-2">💼 Pekerjaan</label>
              <select 
                value={job} 
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(jobData).map(([key, data]) => (
                  <option key={key} value={key} className="bg-slate-800">{data.name}</option>
                ))}
              </select>
            </div>

            {/* Gaya Hidup */}
            <div>
              <label className="block text-sm font-medium mb-2">✨ Gaya Hidup</label>
              <select 
                value={lifestyle} 
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(lifestyleFactors).map(([key, data]) => (
                  <option key={key} value={key} className="bg-slate-800">{data.name}</option>
                ))}
              </select>
            </div>

            {/* Inflasi */}
            <div>
              <label className="block text-sm font-medium mb-2">📈 Inflasi: {inflation}%</label>
              <input 
                type="range" 
                min="3" 
                max="10" 
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-medium">Status Finansial</span>
              {firstPositiveYear ? <CheckCircle className="text-green-400" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
            </div>
            <p className="text-2xl font-bold">
              {firstPositiveYear ? `Surplus di Tahun ${firstPositiveYear}` : 'Perlu Penyesuaian'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm font-medium">Kenaikan Biaya (5 Tahun)</span>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <p className="text-2xl font-bold">+{totalIncrease}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 text-sm font-medium">Biaya Tahun 1</span>
              <TrendingDown className="text-purple-400" size={20} />
            </div>
            <p className="text-2xl font-bold">{formatRupiah(simulationData[0].totalCost)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-xl font-semibold mb-4">📊 Proyeksi Gaji vs Biaya Hidup</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="year" stroke="#fff" label={{ value: 'Tahun', position: 'insideBottom', offset: -5, fill: '#fff' }} />
              <YAxis stroke="#fff" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                formatter={(value: number) => formatRupiah(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={3} name="Gaji" dot={{ r: 5 }} />
              <Line type="monotone" dataKey="totalCost" stroke="#ef4444" strokeWidth={3} name="Biaya Hidup" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detail Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4">📋 Detail Proyeksi Per Tahun</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="pb-3 pr-4">Tahun</th>
                  <th className="pb-3 pr-4">Gaji</th>
                  <th className="pb-3 pr-4">Sewa/Kos</th>
                  <th className="pb-3 pr-4">Makan</th>
                  <th className="pb-3 pr-4">Transport</th>
                  <th className="pb-3 pr-4">Internet</th>
                  <th className="pb-3 pr-4">Lifestyle</th>
                  <th className="pb-3 pr-4">Total Biaya</th>
                  <th className="pb-3">Sisa</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((data) => (
                  <tr key={data.year} className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">{data.year}</td>
                    <td className="py-3 pr-4 text-green-400">{formatRupiah(data.salary)}</td>
                    <td className="py-3 pr-4 text-gray-300">{formatRupiah(data.rent)}</td>
                    <td className="py-3 pr-4 text-gray-300">{formatRupiah(data.food)}</td>
                    <td className="py-3 pr-4 text-gray-300">{formatRupiah(data.transport)}</td>
                    <td className="py-3 pr-4 text-gray-300">{formatRupiah(data.internet)}</td>
                    <td className="py-3 pr-4 text-gray-300">{formatRupiah(data.lifestyleExp)}</td>
                    <td className="py-3 pr-4 text-red-400 font-medium">{formatRupiah(data.totalCost)}</td>
                    <td className={`py-3 font-bold ${data.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatRupiah(data.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekomendasi */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            💡 Rekomendasi
          </h3>
          {simulationData[0].balance < 0 ? (
            <div className="space-y-2 text-gray-200">
              <p>• Gaji awal Anda ({formatRupiah(simulationData[0].salary)}) kurang dari biaya hidup ({formatRupiah(simulationData[0].totalCost)})</p>
              <p>• Pertimbangkan untuk memilih gaya hidup <strong>Hemat</strong> atau cari pekerjaan dengan gaji lebih tinggi</p>
              <p>• Kota alternatif dengan biaya lebih rendah: Yogyakarta atau Medan</p>
            </div>
          ) : (
            <div className="space-y-2 text-gray-200">
              <p>• Selamat! Gaji Anda sudah cukup untuk menutupi biaya hidup sejak tahun pertama</p>
              <p>• Surplus tahun 1: <strong className="text-green-400">{formatRupiah(simulationData[0].balance)}</strong></p>
              <p>• Pertimbangkan untuk menabung minimal 20% dari surplus untuk dana darurat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}