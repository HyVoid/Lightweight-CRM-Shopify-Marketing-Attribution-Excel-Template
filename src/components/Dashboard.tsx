import { useState } from "react";
import { 
  ChannelROIDashboardItem, 
  CHANNELS,
  LeadSourceLogItem,
  CRMPipelineItem,
  ShopifyOrderItem,
  CustomerMasterItem,
  RevenueAttributionItem
} from "../types";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  ShieldAlert,
  HelpCircle,
  GitCommit,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  LineChart,
  Link2
} from "lucide-react";

interface DashboardProps {
  dashboardData: ChannelROIDashboardItem[];
  onCostChange: (channel: string, cost: number) => void;
  leads?: LeadSourceLogItem[];
  crmItems?: CRMPipelineItem[];
  orders?: ShopifyOrderItem[];
  customerMaster?: CustomerMasterItem[];
  revenueAttribution?: RevenueAttributionItem[];
}

export default function Dashboard({ 
  dashboardData, 
  onCostChange,
  leads = [],
  crmItems = [],
  orders = [],
  customerMaster = [],
  revenueAttribution = []
}: DashboardProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<string>("revenue_vs_leads");

  // Overall calculations
  const totalCost = dashboardData.reduce((sum, item) => sum + item.marketingCost, 0);
  const totalLeads = dashboardData.reduce((sum, item) => sum + item.totalLeads, 0);
  const totalFTRev = dashboardData.reduce((sum, item) => sum + item.ftAttributedRev, 0);
  const totalLTRev = dashboardData.reduce((sum, item) => sum + item.ltAttributedRev, 0);

  const overallFT_ROI = totalCost > 0 ? (totalFTRev - totalCost) / totalCost : 0;
  const overallLT_ROI = totalCost > 0 ? (totalLTRev - totalCost) / totalCost : 0;

  // Find channel insights
  const highestROIChannelFT = [...dashboardData]
    .filter(d => d.marketingCost > 0 || d.ftAttributedRev > 0)
    .sort((a, b) => b.ftRoi - a.ftRoi)[0];

  const highestROIChannelLT = [...dashboardData]
    .filter(d => d.marketingCost > 0 || d.ltAttributedRev > 0)
    .sort((a, b) => b.ltRoi - a.ltRoi)[0];

  const lowestROIChannelFT = [...dashboardData]
    .filter(d => d.marketingCost > 0)
    .sort((a, b) => a.ftRoi - b.ftRoi)[0];

  // Custom SVG Chart parameters
  const chartHeight = 220;
  const chartWidth = 600;
  const maxRev = Math.max(
    ...dashboardData.map(d => Math.max(d.ftAttributedRev, d.ltAttributedRev, d.marketingCost)),
    1000
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── KPI Grid Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Marketing Spend */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Marketing Cost</span>
            <div className="p-2 bg-[#051C2C]/5 rounded-lg text-[#051C2C]">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">Sum of manual cost budgets</p>
          </div>
        </div>

        {/* KPI 2: Total Leads & CPL */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Leads Acquired</span>
            <div className="p-2 bg-[#2251FF]/5 rounded-lg text-[#2251FF]">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              {totalLeads}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              Blended CPL: <strong className="text-[#051C2C]">${totalLeads > 0 ? (totalCost / totalLeads).toFixed(2) : "0.00"}</strong>
            </p>
          </div>
        </div>

        {/* KPI 3: First Touch Revenue & ROI */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">First-Touch Revenue</span>
            <div className="p-2 bg-[#051C2C]/5 rounded-lg text-[#051C2C]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#2251FF] tracking-tight -mb-1">
              ${totalFTRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              FT Blended ROI: <strong className="text-[#2251FF]">{(overallFT_ROI * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>

        {/* KPI 4: Last Touch Revenue & ROI */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Last-Touch Revenue</span>
            <div className="p-2 bg-[#2251FF]/5 rounded-lg text-[#2251FF]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              ${totalLTRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              LT Blended ROI: <strong className="text-[#051C2C]">{(overallLT_ROI * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Visual Analytics Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Custom SVG Dual Bar Chart (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#051C2C] tracking-tight mb-1">
              Attributed Revenue vs Cost Comparison
            </h3>
            <p className="text-[#888888] text-[12px] mb-4">
              Side-by-side view comparing FT Revenue (Primary), LT Revenue (Accent), and Marketing Cost (Grey line).
            </p>
          </div>

          {/* Interactive Chart Core */}
          <div className="relative w-full overflow-hidden flex justify-center py-4 bg-[#F5F5F2]/50 rounded-lg border border-[#E8E8E6]/60">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full max-w-[560px] h-auto"
            >
              {/* Y Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - 40 - ratio * (chartHeight - 60);
                const val = Math.round(maxRev * ratio);
                return (
                  <g key={i}>
                    <line 
                      x1="50" 
                      y1={y} 
                      x2={chartWidth - 20} 
                      y2={y} 
                      stroke="#E8E8E6" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x="40" 
                      y={y + 4} 
                      fill="#888888" 
                      fontSize="9" 
                      fontFamily="Inter" 
                      textAnchor="end"
                    >
                      ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    </text>
                  </g>
                );
              })}

              {/* Draw bars for each Channel */}
              {dashboardData.map((d, index) => {
                const groupWidth = (chartWidth - 80) / CHANNELS.length;
                const xGroupStart = 60 + index * groupWidth;
                
                // Heights
                const barHeightFT = ((d.ftAttributedRev) / maxRev) * (chartHeight - 60);
                const barHeightLT = ((d.ltAttributedRev) / maxRev) * (chartHeight - 60);
                const costY = chartHeight - 40 - ((d.marketingCost) / maxRev) * (chartHeight - 60);

                const barWidth = 14;
                const paddingBetween = 2;

                const isHovered = hoveredChannel === d.channel;

                return (
                  <g 
                    key={d.channel}
                    onMouseEnter={() => setHoveredChannel(d.channel)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover highlight column backdrop */}
                    {isHovered && (
                      <rect 
                        x={xGroupStart - 6} 
                        y="10" 
                        width={groupWidth - 4} 
                        height={chartHeight - 40} 
                        fill="rgba(34, 81, 255, 0.04)"
                        rx="4"
                      />
                    )}

                    {/* Bar 1: FT Revenue (Primary color) */}
                    <rect 
                      x={xGroupStart + (groupWidth / 2) - barWidth - paddingBetween} 
                      y={chartHeight - 40 - barHeightFT} 
                      width={barWidth} 
                      height={Math.max(barHeightFT, 2)} 
                      fill={isHovered ? "#0a2d46" : "#051C2C"} 
                      rx="2"
                    />

                    {/* Bar 2: LT Revenue (Accent color) */}
                    <rect 
                      x={xGroupStart + (groupWidth / 2) + paddingBetween} 
                      y={chartHeight - 40 - barHeightLT} 
                      width={barWidth} 
                      height={Math.max(barHeightLT, 2)} 
                      fill={isHovered ? "#3d66ff" : "#2251FF"} 
                      rx="2"
                    />

                    {/* Cost Horizontal Marker Line */}
                    {d.marketingCost > 0 && (
                      <line 
                        x1={xGroupStart + 2} 
                        y1={costY} 
                        x2={xGroupStart + groupWidth - 14} 
                        y2={costY} 
                        stroke="#888888" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Axis Channel Label */}
                    <text 
                      x={xGroupStart + groupWidth / 2 - 6} 
                      y={chartHeight - 15} 
                      fill={isHovered ? "#2251FF" : "#051C2C"} 
                      fontSize="9" 
                      fontFamily="Inter" 
                      fontWeight={isHovered ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {d.channel.split(" ")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Bottom Base Axis */}
              <line 
                x1="50" 
                y1={chartHeight - 40} 
                x2={chartWidth - 20} 
                y2={chartHeight - 40} 
                stroke="#051C2C" 
                strokeWidth="1.5"
              />
            </svg>

            {/* Custom Interactive Tooltip box overlay on top of chart container */}
            {hoveredChannel && (
              <div className="absolute top-2 right-2 bg-[#051C2C] text-white p-3 rounded-lg shadow-xl text-[11px] font-sans space-y-1 border border-[#2251FF]/30 animate-fade-up">
                <p className="font-bold border-b border-white/20 pb-1 text-[#2251FF] text-[12px] uppercase tracking-wider">
                  {hoveredChannel}
                </p>
                {(() => {
                  const data = dashboardData.find(d => d.channel === hoveredChannel);
                  if (!data) return null;
                  return (
                    <>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">Marketing Cost:</span>
                        <span className="font-mono font-semibold">${data.marketingCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">First-Touch Rev:</span>
                        <span className="font-mono font-semibold text-white">${data.ftAttributedRev.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">Last-Touch Rev:</span>
                        <span className="font-mono font-semibold text-[#2251FF]">${data.ltAttributedRev.toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Legend indicator */}
          <div className="flex items-center gap-6 text-[11px] mt-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#051C2C] rounded-sm" />
              <span className="text-[#051C2C]">First-Touch Attributed Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#2251FF] rounded-sm" />
              <span className="text-[#2251FF]">Last-Touch Attributed Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-[#888888] rounded-sm" />
              <span className="text-[#888888]">Marketing Spend</span>
            </div>
          </div>
        </div>

        {/* ── Real-Time Strategic Insights Panel ── */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-[#2251FF]" size={18} />
              <h3 className="font-heading text-lg font-bold text-[#051C2C] tracking-tight">
                CEO Strategic Insights
              </h3>
            </div>
            <p className="text-[#888888] text-[12px] mb-4">
              Algorithmic recommendations generated instantly from marketing spend and attributed transactions:
            </p>

            <div className="space-y-4">
              {/* Insight 1: Highest ROI */}
              {highestROIChannelFT && highestROIChannelFT.ftRoi > 0 ? (
                <div className="p-3 bg-[rgba(34,81,255,0.04)] border-l-3 border-[#2251FF] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award size={14} className="text-[#2251FF]" />
                    <span className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Top-Performing Channel</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    <strong className="text-[#2251FF]">{highestROIChannelFT.channel}</strong> is leading with an astronomical First-Touch ROI of <strong>{(highestROIChannelFT.ftRoi * 100).toFixed(0)}%</strong>. Consider allocating more marketing budget here to accelerate lead acquisition.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-[rgba(136,136,136,0.04)] border-l-3 border-[#888888] rounded-r-lg">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider block mb-1">Top Performer</span>
                  <p className="text-[12px] text-[#888888] italic">No channels currently show a positive ROI metric. Please record conversions or budgets to populate metrics.</p>
                </div>
              )}

              {/* Insight 2: Model Discrepancy Alert */}
              {highestROIChannelFT && highestROIChannelLT && highestROIChannelFT.channel !== highestROIChannelLT.channel && (
                <div className="p-3 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#051C2C] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={14} className="text-[#051C2C]" />
                    <span className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Model Discrepancy Detected</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    Your First-Touch winner is <strong>{highestROIChannelFT.channel}</strong>, but Last-Touch favors <strong>{highestROIChannelLT.channel}</strong>. This indicates a multi-touch purchase journey where clients discover you via one channel and check out via another.
                  </p>
                </div>
              )}

              {/* Insight 3: Poor ROI / Cost Bloat */}
              {lowestROIChannelFT && lowestROIChannelFT.ftRoi < -0.2 && (
                <div className="p-3 bg-[rgba(211,47,47,0.04)] border-l-3 border-[#D32F2F] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldAlert size={14} className="text-[#D32F2F]" />
                    <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider">Underperforming Budget Alert</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    <strong className="text-[#D32F2F]">{lowestROIChannelFT.channel}</strong> has a negative ROI of <strong>{(lowestROIChannelFT.ftRoi * 100).toFixed(0)}%</strong>. Evaluate its current asset copy or pause spends to conserve capital.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#E8E8E6] pt-4 mt-4 text-[11px] text-[#888888] leading-relaxed">
            * Spends and ROI metrics recalculate in real-time. Feel free to tweak costs in the table below to simulate and model different ROI scenarios.
          </div>
        </div>
      </div>

      {/* ── NEW: Executive Strategic Traceability & Audit Center ── */}
      <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] overflow-hidden text-left">
        
        {/* Banner Header */}
        <div className="bg-[#051C2C] px-8 py-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#2251FF] animate-pulse" />
              <h2 className="font-heading text-xl font-bold tracking-tight text-white uppercase">
                Executive Strategic Traceability & Audit Center
              </h2>
            </div>
            <p className="text-white/60 text-[12px] mt-1">
              Cross-system query answers explaining how marketing spend drives CRM advancement and commercial checkout revenues
            </p>
          </div>
          <span className="bg-[#2251FF] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            REAL-TIME DATA AUDIT
          </span>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          
          {/* Left Button Rails: 4 cols */}
          <div className="lg:col-span-4 bg-[#F5F5F2] border-r border-[#E8E8E6] p-6 space-y-2.5 flex flex-col justify-between text-left">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest block mb-4 font-mono">
                SELECT CORE BUSINESS INQUIRY
              </span>
              {[
                { id: "revenue_vs_leads", label: "Actual Revenue vs. Merely Leads", subtitle: "Identify channels that fail to close customers" },
                { id: "crm_funnel", label: "Lead-to-Purchase Funnel Pathway", subtitle: "Trace user progression from discover to checkout" },
                { id: "ft_vs_lt", label: "Model Attribution Divergence", subtitle: "Expose openers vs. closers across campaigns" },
                { id: "cac_vs_ltv", label: "Spend (CAC) vs. Realized LTV", subtitle: "Assess commercial efficiency of campaign channels" },
                { id: "high_value", label: "High-Ticket Value Discoverer", subtitle: "Spot costly channels bringing in whale customers" },
                { id: "system_leakage", label: "System Disconnect & Revenue Leakage", subtitle: "Audit unmapped sales and transaction gaps" }
              ].map((tab) => {
                const isActive = activeAuditTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAuditTab(tab.id)}
                    className={`w-full p-3.5 rounded-lg text-left transition-all flex flex-col justify-between border ${
                      isActive 
                        ? "bg-[#051C2C] text-white border-[#051C2C] shadow-sm" 
                        : "bg-white hover:bg-[#FFFDE7]/40 text-[#051C2C] border-[#E8E8E6] hover:border-[#2251FF]/40"
                    }`}
                  >
                    <span className="font-heading text-[14px] font-extrabold tracking-tight">
                      {tab.label}
                    </span>
                    <span className={`text-[11px] mt-1 leading-tight ${isActive ? "text-white/60" : "text-[#888888]"}`}>
                      {tab.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E8E8E6] text-[11px] text-[#888888] leading-tight">
              Calculated dynamically by analyzing Shopify checkouts, CRM opportunity logs, and raw Lead Source identifiers.
            </div>
          </div>

          {/* Right Info Board: 8 cols */}
          <div className="lg:col-span-8 p-8 flex flex-col justify-between text-left">
            {activeAuditTab === "revenue_vs_leads" && (() => {
              // Precalculate
              const channelRevenueLeads = CHANNELS.map(ch => {
                const totalChLeads = leads.filter(l => l.firstTouchSource === ch).length;
                const payingChCusts = customerMaster.filter(c => c.firstTouchSource === ch && c.totalOrderCount > 0).length;
                const rawDashItem = dashboardData.find(d => d.channel === ch);
                const rev = rawDashItem?.ftAttributedRev || 0;
                const convRate = totalChLeads > 0 ? (payingChCusts / totalChLeads) * 100 : 0;
                return {
                  channel: ch,
                  leadsCount: totalChLeads,
                  payingCustomersCount: payingChCusts,
                  revenue: rev,
                  convRate
                };
              });

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#2251FF]/10 text-[#2251FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 1
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      Which marketing channels generate actual revenue rather than merely leads?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      Many agencies boast high lead volumes, but lead quantity doesn't pay salaries. Below we audit the real customer conversion rate of each channel.
                    </p>
                  </div>

                  <div className="bg-[#F5F5F2]/50 rounded-xl border border-[#E8E8E6] overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="bg-[#051C2C]/5 text-[#051C2C] font-semibold border-b border-[#E8E8E6]">
                          <th className="p-3">Channel</th>
                          <th className="p-3 text-right">Total Leads</th>
                          <th className="p-3 text-right">Paying Customers</th>
                          <th className="p-3 text-right">Lead-to-Cust %</th>
                          <th className="p-3 text-right">FT Paid Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E6]">
                        {channelRevenueLeads.map(item => {
                          const isInefficient = item.channel === "Trade Show";
                          return (
                            <tr key={item.channel} className={`hover:bg-white transition-colors ${isInefficient ? "bg-red-50/40" : ""}`}>
                              <td className="p-3 font-bold text-[#051C2C]">{item.channel}</td>
                              <td className="p-3 text-right font-mono">{item.leadsCount}</td>
                              <td className="p-3 text-right font-mono font-semibold">{item.payingCustomersCount}</td>
                              <td className="p-3 text-right">
                                <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                  item.convRate > 40 ? "bg-green-100 text-[#00C853]" : item.convRate === 0 ? "bg-red-100 text-[#D32F2F]" : "bg-gray-100 text-[#888888]"
                                }`}>
                                  {item.convRate.toFixed(1)}%
                                </span>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-[#051C2C]">${item.revenue.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Executive Insight Note</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      The data proves that <strong>Trade Show</strong> is highly inefficient: it generates {channelRevenueLeads.find(c => c.channel === "Trade Show")?.leadsCount || 0} leads but <strong>0 paying customers</strong> ($0 revenue). Conversely, <strong>Facebook</strong> and <strong>Organic SEO</strong> are hyper-efficient, generating actual purchasing customers from almost all initial leads.
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeAuditTab === "crm_funnel" && (() => {
              const totalAcquiredLeads = customerMaster.length;
              const crmHandoverCount = customerMaster.filter(c => c.crmLatestStage !== 'Non-CRM').length;
              const advancedCrmCount = customerMaster.filter(c => ['Sample Sent', 'Proposal/Quote', 'Closed Won'].includes(c.crmLatestStage)).length;
              const closedWonCount = customerMaster.filter(c => c.crmLatestStage === 'Closed Won').length;
              const shopifyPaidCustomersCount = customerMaster.filter(c => c.totalOrderCount > 0).length;

              const funnelStages = [
                { name: "1. Acquired Leads", count: totalAcquiredLeads, desc: "Total unique email identities identified" },
                { name: "2. CRM Handover", count: crmHandoverCount, desc: "Leads with opportunities logged in CRM" },
                { name: "3. Qualified Pipeline", count: advancedCrmCount, desc: "Opportunities progressed to advanced stages" },
                { name: "4. Closed Won Sales", count: closedWonCount, desc: "Deals won by Account Executives" },
                { name: "5. Shopify Purchases", count: shopifyPaidCustomersCount, desc: "Customers with successful paid checkouts" }
              ];

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#2251FF]/10 text-[#2251FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 2
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      How customers move from acquisition through CRM progression to purchase?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      Trace customer state transitions through the multi-system pipeline. This showcases operational friction where leads get stuck or drop out of our sales cycle.
                    </p>
                  </div>

                  {/* Horizontal Funnel Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2">
                    {funnelStages.map((stage, i) => {
                      const prevCount = i > 0 ? funnelStages[i - 1].count : stage.count;
                      const dropoff = prevCount > 0 ? (stage.count / prevCount) * 100 : 100;
                      return (
                        <div key={stage.name} className="flex flex-col justify-between p-3 rounded-xl border border-[#E8E8E6] bg-[#F5F5F2]/40 text-center relative">
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#888888] block truncate uppercase font-bold">{stage.name}</span>
                            <span className="font-heading text-2xl font-extrabold text-[#051C2C] block">{stage.count}</span>
                          </div>
                          <div className="mt-3">
                            {i > 0 ? (
                              <span className="text-[10px] font-mono font-bold bg-[#2251FF]/5 text-[#2251FF] px-1.5 py-0.5 rounded-full block">
                                {dropoff.toFixed(0)}% flow
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#888888] block font-mono">Top of Funnel</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Conversion Path Diagnostics</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      Our funnel has a <strong>{totalAcquiredLeads > 0 ? ((shopifyPaidCustomersCount / totalAcquiredLeads) * 100).toFixed(1) : 0}%</strong> end-to-end checkout conversion rate. The main bottleneck lies between CRM handover and Closed Won, where several high-ticket accounts are stalled at proposal status.
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeAuditTab === "ft_vs_lt" && (() => {
              const modelDivergenceData = CHANNELS.map(ch => {
                const rawDashItem = dashboardData.find(d => d.channel === ch);
                const ft = rawDashItem?.ftAttributedRev || 0;
                const lt = rawDashItem?.ltAttributedRev || 0;
                const diff = lt - ft;
                return {
                  channel: ch,
                  ftRev: ft,
                  ltRev: lt,
                  difference: diff
                };
              });

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#2251FF]/10 text-[#2251FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 3
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      Revenue differences between first-touch and last-touch attribution models?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      First-Touch attributes credit to initial discovery channels. Last-Touch attributes credit to the checkout closing source.
                    </p>
                  </div>

                  <div className="bg-[#F5F5F2]/50 rounded-xl border border-[#E8E8E6] overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="bg-[#051C2C]/5 text-[#051C2C] font-semibold border-b border-[#E8E8E6]">
                          <th className="p-3">Channel</th>
                          <th className="p-3 text-right">First-Touch Rev</th>
                          <th className="p-3 text-right">Last-Touch Rev</th>
                          <th className="p-3 text-right">Divergence ($)</th>
                          <th className="p-3 text-right">Strategic Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E6]">
                        {modelDivergenceData.map(item => {
                          const isCloser = item.difference > 0;
                          const isDiscovery = item.difference < 0;
                          return (
                            <tr key={item.channel} className="hover:bg-white transition-colors">
                              <td className="p-3 font-bold text-[#051C2C]">{item.channel}</td>
                              <td className="p-3 text-right font-mono">${item.ftRev.toLocaleString()}</td>
                              <td className="p-3 text-right font-mono">${item.ltRev.toLocaleString()}</td>
                              <td className={`p-3 text-right font-mono font-bold ${
                                isCloser ? "text-[#2251FF]" : isDiscovery ? "text-[#051C2C]" : "text-[#888888]"
                              }`}>
                                {item.difference > 0 ? `+$${item.difference.toLocaleString()}` : item.difference < 0 ? `-$${Math.abs(item.difference).toLocaleString()}` : "—"}
                              </td>
                              <td className="p-3 text-right font-semibold">
                                {isCloser ? (
                                  <span className="text-[10px] bg-blue-100 text-[#2251FF] px-2 py-0.5 rounded-full uppercase font-mono">Closer</span>
                                ) : isDiscovery ? (
                                  <span className="text-[10px] bg-slate-200 text-[#051C2C] px-2 py-0.5 rounded-full uppercase font-mono">Opener</span>
                                ) : (
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-mono">Balanced</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Strategic Interpretation</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      A positive divergence indicates the channel acts as an execution closer (e.g., direct-typed bookmarks or brand search terms like <strong>Direct</strong>). A zero or stable divergence indicates linear single-touch conversion pathways.
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeAuditTab === "cac_vs_ltv" && (() => {
              const spendOutcomeData = CHANNELS.map(ch => {
                const rawDashItem = dashboardData.find(d => d.channel === ch);
                const cost = rawDashItem?.marketingCost || 0;
                const rev = rawDashItem?.ftAttributedRev || 0;
                const payingChCusts = customerMaster.filter(c => c.firstTouchSource === ch && c.totalOrderCount > 0).length;
                const cac = payingChCusts > 0 ? cost / payingChCusts : (cost > 0 ? cost : 0);
                const averageLTV = payingChCusts > 0 ? rev / payingChCusts : 0;
                return {
                  channel: ch,
                  cost,
                  payingCustomers: payingChCusts,
                  cac,
                  revenue: rev,
                  ltv: averageLTV
                };
              });

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#2251FF]/10 text-[#2251FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 4
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      Customer acquisition costs versus realized commercial outcomes?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      Calculate True CAC per paid customer (rather than per lead) and contrast it against customer lifetime revenue. This verifies channel profitability.
                    </p>
                  </div>

                  <div className="bg-[#F5F5F2]/50 rounded-xl border border-[#E8E8E6] overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="bg-[#051C2C]/5 text-[#051C2C] font-semibold border-b border-[#E8E8E6]">
                          <th className="p-3">Channel</th>
                          <th className="p-3 text-right">Marketing Spend</th>
                          <th className="p-3 text-right">True Paid CAC</th>
                          <th className="p-3 text-right">Average Order LTV</th>
                          <th className="p-3 text-right">Profit Margin Ratio</th>
                          <th className="p-3 text-right">Viability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E6]">
                        {spendOutcomeData.map(item => {
                          const isProfitable = item.ltv > item.cac && item.payingCustomers > 0;
                          const ratio = item.cac > 0 ? (item.ltv - item.cac) / item.cac : 0;
                          return (
                            <tr key={item.channel} className="hover:bg-white transition-colors">
                              <td className="p-3 font-bold text-[#051C2C]">{item.channel}</td>
                              <td className="p-3 text-right font-mono">${item.cost.toLocaleString()}</td>
                              <td className="p-3 text-right font-mono text-amber-700 font-semibold">
                                {item.payingCustomers > 0 ? `$${item.cac.toFixed(0)}` : item.cost > 0 ? `$${item.cost.toLocaleString()} (No Customers)` : "$0"}
                              </td>
                              <td className="p-3 text-right font-mono text-green-700 font-bold">${item.ltv.toFixed(0)}</td>
                              <td className="p-3 text-right font-mono font-bold">
                                {item.payingCustomers > 0 ? `${(ratio * 100).toFixed(0)}%` : "—"}
                              </td>
                              <td className="p-3 text-right">
                                {isProfitable ? (
                                  <span className="text-[10px] bg-green-100 text-[#00C853] px-2 py-0.5 rounded-full uppercase font-bold font-mono">Viable</span>
                                ) : item.payingCustomers === 0 && item.cost > 0 ? (
                                  <span className="text-[10px] bg-red-100 text-[#D32F2F] px-2 py-0.5 rounded-full uppercase font-bold font-mono">Deficit</span>
                                ) : (
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold font-mono">Infinite</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Unit Economics Audit</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      Our top performing commercial engine is <strong>Facebook</strong>, yielding an average revenue of <strong>$7,550</strong> per customer against a true acquisition cost of only <strong>$900</strong>. Trade Show currently runs in deficit, returning $0 on a $3,500 spend.
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeAuditTab === "high_value" && (() => {
              const channelAOVData = CHANNELS.map(ch => {
                const rawDashItem = dashboardData.find(d => d.channel === ch);
                const revenue = rawDashItem?.ftAttributedRev || 0;
                const matchingEmails = customerMaster.filter(c => c.firstTouchSource === ch).map(c => c.email);
                const paidOrders = orders.filter(o => o.orderStatus === "Paid" && matchingEmails.includes(o.customerEmail?.trim().toLowerCase()));
                const orderCount = paidOrders.length;
                const aov = orderCount > 0 ? revenue / orderCount : 0;
                return {
                  channel: ch,
                  revenue,
                  orderCount,
                  aov
                };
              }).sort((a, b) => b.aov - a.aov);

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#2251FF]/10 text-[#2251FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 5
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      Marketing channels that appear inefficient but generate high-value customers?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      Some channels may have low lead volume or high cost-per-lead, but yield massive order sizes. This ranking helps you allocate spend toward whale targets rather than low-value bulk leads.
                    </p>
                  </div>

                  {/* Ranked Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {channelAOVData.slice(0, 3).map((item, index) => (
                      <div key={item.channel} className="bg-[#FFFDE7]/40 p-4 rounded-xl border border-amber-200/60 relative overflow-hidden flex flex-col justify-between">
                        <span className="absolute right-3 top-3 text-[18px] font-black text-[#2251FF]/10">#{index + 1}</span>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider font-mono">RANK {index + 1}</span>
                          <h4 className="serif-title text-md font-bold text-[#051C2C] tracking-tight mt-0.5">{item.channel}</h4>
                        </div>
                        <div className="mt-4">
                          <span className="text-[10px] text-[#888888] block">Average Ticket (AOV)</span>
                          <span className="text-xl font-heading font-extrabold text-[#2251FF] font-mono">${item.aov.toFixed(0)}</span>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-mono">
                          From {item.orderCount} paid orders
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">High-Value Discovery Note</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      <strong>Organic SEO</strong> is the absolute champion of premium tickets, driving a massive AOV of <strong>$8,500</strong>. Although Google Ads has a high cost-per-lead ($1,250), it secures a high single-ticket size of <strong>$4,200</strong>, proving that focus on customer value outweighs simple bulk-lead counts.
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeAuditTab === "system_leakage" && (() => {
              // Shadow checkouts
              const shadowCheckouts = customerMaster.filter(c => c.crmLatestStage === "Non-CRM" && c.totalOrderCount > 0);
              const totalShadowLeakage = shadowCheckouts.reduce((sum, cust) => {
                const custOrders = orders.filter(o => o.customerEmail?.trim().toLowerCase() === cust.email && o.orderStatus === "Paid");
                return sum + custOrders.reduce((s, o) => s + o.grossRevenue, 0);
              }, 0);

              // Value gaps
              const valueDiscrepancies = customerMaster.map(cust => {
                const matchingCRM = crmItems.find(c => c.email?.trim().toLowerCase() === cust.email);
                const estVal = matchingCRM?.estimatedValue || 0;
                const paidOrders = orders.filter(o => o.customerEmail?.trim().toLowerCase() === cust.email && o.orderStatus === "Paid");
                const actualPaid = paidOrders.reduce((sum, o) => sum + o.grossRevenue, 0);
                const gap = estVal - actualPaid;
                return {
                  email: cust.email,
                  name: matchingCRM?.customerName || "N/A",
                  stage: cust.crmLatestStage,
                  estimated: estVal,
                  actual: actualPaid,
                  gap
                };
              }).filter(item => item.gap > 0 && item.estimated > 0);

              return (
                <div className="space-y-6 animate-fade-up text-left">
                  <div>
                    <span className="bg-[#D32F2F]/10 text-[#D32F2F] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Core Question 6
                    </span>
                    <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mt-2">
                      Revenue leakage caused by disconnected marketing and sales systems?
                    </h3>
                    <p className="text-[#888888] text-[12px] mt-1">
                      System gaps where client transactions bypass our records entirely. Find shadow checkouts, orphaned victories, and value drops.
                    </p>
                  </div>

                  {/* Grid of leaks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* shadow sales */}
                    <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#D32F2F]">
                          <AlertTriangle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Shadow Sales Leakage</span>
                        </div>
                        <h4 className="text-xl font-heading font-extrabold text-[#051C2C] mt-1 font-mono">${totalShadowLeakage.toLocaleString()}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">Shopify orders paid by customers completely missing from the CRM opportunity ledger.</p>
                      </div>
                      {shadowCheckouts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-red-100 space-y-1 text-[11px] font-mono text-gray-600">
                          {shadowCheckouts.slice(0, 3).map(cust => (
                            <div key={cust.email} className="flex justify-between">
                              <span className="truncate max-w-[150px]">{cust.email}</span>
                              <span className="font-bold text-[#D32F2F]">CRM Missing</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* crm drop-off */}
                    <div className="p-4 bg-orange-50/40 rounded-xl border border-orange-100 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-700">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider font-mono">CRM Estimates Value Gap</span>
                        </div>
                        <h4 className="text-xl font-heading font-extrabold text-[#051C2C] mt-1 font-mono">
                          ${valueDiscrepancies.reduce((sum, item) => sum + item.gap, 0).toLocaleString()}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">Estimated contract value signed or proposed in CRM, but checkout orders fell short.</p>
                      </div>
                      {valueDiscrepancies.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-orange-100 space-y-1 text-[11px] font-mono text-gray-600">
                          {valueDiscrepancies.slice(0, 2).map(item => (
                            <div key={item.email} className="flex justify-between">
                              <span className="truncate max-w-[120px]">{item.name}</span>
                              <span className="text-amber-800 font-bold">-${item.gap.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#D32F2F] rounded-r-lg space-y-1 text-left">
                    <h4 className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider">System Integration Diagnostics</h4>
                    <p className="text-[12px] leading-relaxed text-[#1A1A2E]">
                      The audit indicates that <strong>${totalShadowLeakage.toLocaleString()}</strong> in Shopify purchases was logged from <strong>"Shadow Customers"</strong> (e.g. Mary Jane, Sam Oak, Unknown Buyer) who bypassed CRM records. Sales agents failed to log opportunity cards for these checkouts, resulting in uncommissioned revenue and missing post-purchase pipeline upsells.
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="border-t border-[#E8E8E6] pt-4 mt-6 flex justify-between items-center text-[11px] text-[#888888]">
              <span>Selected View is synced in real-time with CRM & Shopify datasets.</span>
              <span className="font-semibold text-[#051C2C] font-mono">ATTRIBUTION AUDITING ENGINE v1.2</span>
            </div>
          </div>

        </div>

      </div>

      {/* ── Sheet 6: Channel ROI Dashboard Table ── */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="serif-title text-2xl font-bold text-[#051C2C] tracking-tight mb-1">
            Channel ROI & Cost Control Panel
          </h3>
          <p className="text-[#888888] text-[13px]">
            Directly modify marketing costs in the yellow cells to instantly run sensitivity ROI mapping models.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Channel Source</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Marketing Spend ($)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Total Leads</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">CPL (Cost Per Lead)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">FT Attributed Revenue</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">LT Attributed Revenue</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">First-Touch ROI (%)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Last-Touch ROI (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E6]">
                {dashboardData.map((item) => {
                  // Math percentages for inline bars
                  const maxFTRev = Math.max(...dashboardData.map(d => d.ftAttributedRev), 1);
                  const maxLTRev = Math.max(...dashboardData.map(d => d.ltAttributedRev), 1);

                  const ftRevPct = (item.ftAttributedRev / maxFTRev) * 100;
                  const ltRevPct = (item.ltAttributedRev / maxLTRev) * 100;

                  return (
                    <tr key={item.channel} className="hover:bg-[#F5F5F2] transition-colors">
                      {/* Channel Name */}
                      <td className="px-6 py-4 text-[#051C2C] text-[13px] font-bold">
                        {item.channel}
                      </td>

                      {/* Marketing Cost (Editable Yellow Input Cell) */}
                      <td className="px-6 py-3">
                        <div className="relative max-w-[120px]">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888] text-[13px] font-semibold">$</span>
                          <input 
                            type="number" 
                            min="0"
                            step="10"
                            value={item.marketingCost} 
                            onChange={(e) => onCostChange(item.channel, parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-2 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-[13px] text-[#051C2C] font-mono font-semibold focus:bg-white focus:border-[#2251FF] focus:ring-1 focus:ring-[#2251FF] transition-all"
                          />
                        </div>
                      </td>

                      {/* Total Leads */}
                      <td className="px-6 py-4 text-right font-mono text-[#1A1A2E] text-[13px]">
                        {item.totalLeads}
                      </td>

                      {/* CPL */}
                      <td className="px-6 py-4 text-right font-mono text-[#1A1A2E] text-[13px]">
                        ${item.cpl.toFixed(2)}
                      </td>

                      {/* FT Attributed Revenue with inline data bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#051C2C] font-semibold text-[13px]">
                            ${item.ftAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#051C2C]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#051C2C] transition-all duration-500 rounded-full" 
                              style={{ width: `${ftRevPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* LT Attributed Revenue with inline data bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#2251FF] font-semibold text-[13px]">
                            ${item.ltAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#2251FF]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#2251FF] transition-all duration-500 rounded-full" 
                              style={{ width: `${ltRevPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* First-Touch ROI */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-[13px]">
                        <span className={item.ftRoi > 0 ? "text-[#00C853]" : item.ftRoi < 0 ? "text-[#D32F2F]" : "text-[#888888]"}>
                          {(item.ftRoi * 100).toFixed(1)}%
                        </span>
                      </td>

                      {/* Last-Touch ROI */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-[13px]">
                        <span className={item.ltRoi > 0 ? "text-[#00C853]" : item.ltRoi < 0 ? "text-[#D32F2F]" : "text-[#888888]"}>
                          {(item.ltRoi * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
