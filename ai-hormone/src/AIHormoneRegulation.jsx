
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AIHormoneRegulation() {
  const [data, setData] = useState([{ time: 0, hypothalamus: 50, pituitary: 50, target: 50 }]);
  const [time, setTime] = useState(0);
  const [stimulus, setStimulus] = useState("正常");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState("");

  const simulateStep = (prev) => {
    let deltaStimulus = 0;
    if (stimulus === "寒冷") deltaStimulus = 5;
    if (stimulus === "炎热") deltaStimulus = -5;

    const newHypothalamus = Math.max(0, Math.min(100, prev.hypothalamus + deltaStimulus + (Math.random() - 0.5)));
    const newPituitary = Math.max(0, Math.min(100, prev.pituitary + (newHypothalamus - prev.pituitary) * 0.2));
    const feedback = (50 - prev.target) * 0.1 - (prev.target - 50) * 0.05;
    const newTarget = Math.max(0, Math.min(100, prev.target + (newPituitary - prev.target) * 0.15 + feedback));

    return {
      hypothalamus: newHypothalamus,
      pituitary: newPituitary,
      target: newTarget
    };
  };

  const generateReport = (last) => {
    let trend = "";
    if (stimulus === "寒冷") trend += "寒冷刺激增强下丘脑和垂体活动，促使靶腺激素分泌升高。";
    else if (stimulus === "炎热") trend += "炎热刺激抑制下丘脑活动，激素分泌下降，降低代谢速率。";
    else trend += "在正常条件下，激素水平维持在稳态附近波动。";

    const feedbackEffect = last.target > 55 ? "靶腺激素水平偏高，反馈抑制下丘脑与垂体分泌。" : last.target < 45 ? "靶腺激素水平偏低，反馈促进上游激素分泌。" : "反馈作用维持平衡状态。";

    return `AI分析报告：${trend}${feedbackEffect}`;
  };

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
        setData((prevData) => {
          const last = prevData[prevData.length - 1];
          const next = simulateStep(last);
          const newData = [...prevData, { time: prevData.length, ...next }];
          setReport(generateReport(next));
          return newData;
        });
      }, 600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, stimulus]);

  const reset = () => {
    setRunning(false);
    setData([{ time: 0, hypothalamus: 50, pituitary: 50, target: 50 }]);
    setTime(0);
    setReport("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🤖 AI辅助下的激素分级与反馈调节系统</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px", border: "1px solid #ddd", padding: 12, borderRadius: 6, background: "#fff" }}>
          <h2>控制面板</h2>
          <label style={{ display: "block", marginTop: 8 }}>外界刺激：</label>
          <select value={stimulus} onChange={(e) => setStimulus(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
            <option>正常</option>
            <option>寒冷</option>
            <option>炎热</option>
          </select>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => setRunning(!running)} style={{ padding: "8px 12px", marginRight: 8 }}>{running ? "暂停模拟" : "开始模拟"}</button>
            <button onClick={reset} style={{ padding: "8px 12px" }}>重置</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <p>当前外界刺激：<strong>{stimulus}</strong></p>
            <p>时间：<strong>{time}s</strong></p>
            <p>下丘脑激素水平：<strong>{data[data.length - 1].hypothalamus.toFixed(2)}</strong></p>
            <p>垂体激素水平：<strong>{data[data.length - 1].pituitary.toFixed(2)}</strong></p>
            <p>靶腺激素水平：<strong>{data[data.length - 1].target.toFixed(2)}</strong></p>
          </div>
        </div>

        <div style={{ flex: "1 1 480px", border: "1px solid #ddd", padding: 12, borderRadius: 6, background: "#fff" }}>
          <h2>激素调节变化曲线</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: "时间 (s)", position: "insideBottomRight", offset: 0 }} />
                <YAxis label={{ value: "激素水平", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hypothalamus" stroke="#3b82f6" name="下丘脑" dot={false} />
                <Line type="monotone" dataKey="pituitary" stroke="#22c55e" name="垂体" dot={false} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" name="靶腺激素" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
        <h2>📊 AI诊断报告</h2>
        <p>{report || "AI正在等待数据变化以生成诊断..."}</p>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
        <h2>🧠 教学提示</h2>
        <ul>
          <li>模型体现“下丘脑—垂体—靶腺”的三级分级调节机制。</li>
          <li>外界刺激（如寒冷或炎热）通过神经-内分泌途径影响激素分泌。</li>
          <li>反馈调节使激素水平维持稳态，体现了“信息传递—反馈修正—平衡维持”的动态调控。</li>
          <li>典型实例：下丘脑分泌促甲状腺激素释放激素（TRH）作用于垂体，垂体分泌促甲状腺激素（TSH）作用于甲状腺，甲状腺激素（T3/T4）反过来抑制TRH和TSH的分泌，体现三级分级与负反馈的结合。</li>
          <li>AI诊断报告帮助学生理解数据背后的生理逻辑。</li>
        </ul>
      </div>
    </div>
  );
}
