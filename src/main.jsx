import { useState } from "react";
import { createRoot } from "react-dom/client";

const FLOTA = [
  { interno: "24", patente: "AF 988 TS" },
  { interno: "31", patente: "AG 208 SH" },
  { interno: "32", patente: "AF 537 QY" },
  { interno: "35", patente: "AH 950 CR" },
  { interno: "36", patente: "AG301LY" },
  { interno: "38", patente: "AC012DM" },
  { interno: "40", patente: "AG 031 AE" },
  { interno: "41", patente: "AH 996 CF" },
  { interno: "Fox", patente: "JNF364" },
];

const s = {
  label: { fontSize: 13, color: "#666", marginBottom: 4, display: "block" },
  input: { width: "100%", boxSizing: "border-box", fontSize: 16, padding: "12px 14px", borderRadius: 10, border: "2px solid #8B1A2E", background: "#fff", color: "#111", marginBottom: 12 },
  select: { width: "100%", boxSizing: "border-box", fontSize: 16, padding: "12px 14px", borderRadius: 10, border: "2px solid #8B1A2E", background: "#fff", color: "#111", marginBottom: 12 },
  textarea: { width: "100%", boxSizing: "border-box", fontSize: 16, padding: "12px 14px", borderRadius: 10, border: "2px solid #8B1A2E", background: "#fff", color: "#111", marginBottom: 12, resize: "vertical" },
  sectionTitle: { fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", margin: "20px 0 10px" },
  card: { background: "#f9f9f9", borderRadius: 12, border: "0.5px solid #ddd", padding: "14px", marginBottom: 12 },
  saveBtn: { width: "100%", padding: "14px", fontSize: 16, fontWeight: 500, borderRadius: 12, marginTop: 8, border: "none" },
  addBtn: { width: "100%", padding: "12px", fontSize: 15, borderRadius: 12, marginBottom: 10, background: "#f0f0f0", border: "1px solid #ccc" },
};

const capturarMeta = () => new Promise(resolve => {
  const fecha = new Date().toLocaleDateString("es-AR");
  const hora = new Date().toLocaleTimeString("es-AR");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ fecha, hora, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }),
      () => resolve({ fecha, hora, lat: "no disponible", lng: "no disponible" })
    );
  } else {
    resolve({ fecha, hora, lat: "no disponible", lng: "no disponible" });
  }
});

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""} style={s.input} />
    </div>
  );
}

function VehiculoSelect({ value, onChange, otroTexto, onOtroTexto }) {
  return (
    <div>
      <label style={s.label}>Interno / Vehículo</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={s.select}>
        <option value="">Seleccionar...</option>
        {FLOTA.map(v => (
          <option key={v.interno} value={v.interno}>Int {v.interno} — {v.patente}</option>
        ))}
        <option value="otro">Otro (ingresar manualmente)</option>
      </select>
      {value === "otro" && (
        <input type="text" value={otroTexto} onChange={e => onOtroTexto(e.target.value)} placeholder="Ingresá el vehículo manualmente" style={s.input} />
      )}
    </div>
  );
}

function CheckItem({ label, value, onChange }) {
  return (
    <div style={{ borderBottom: "0.5px solid #ddd", paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, flex: 1, background: value.presente ? "#1a7a3a" : "#f0f0f0", border: value.presente ? "2px solid #1a7a3a" : "0.5px solid #ccc", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
          <input type="checkbox" checked={value.presente} onChange={e => onChange({ ...value, presente: e.target.checked })} style={{ width: 20, height: 20 }} />
          <span style={{ color: value.presente ? "#fff" : "#555" }}>Presente</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, flex: 1, background: value.vigente ? "#1a7a3a" : "#f0f0f0", border: value.vigente ? "2px solid #1a7a3a" : "0.5px solid #ccc", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
          <input type="checkbox" checked={value.vigente} onChange={e => onChange({ ...value, vigente: e.target.checked })} style={{ width: 20, height: 20 }} />
          <span style={{ color: value.vigente ? "#fff" : "#555" }}>Vigente</span>
        </label>
      </div>
    </div>
  );
}

function CheckItemConVto({ label, value, onChange, vto, onVto }) {
  return (
    <div style={{ borderBottom: "0.5px solid #ddd", paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, flex: 1, background: value.presente ? "#1a7a3a" : "#f0f0f0", border: value.presente ? "2px solid #1a7a3a" : "0.5px solid #ccc", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
          <input type="checkbox" checked={value.presente} onChange={e => onChange({ ...value, presente: e.target.checked })} style={{ width: 20, height: 20 }} />
          <span style={{ color: value.presente ? "#fff" : "#555" }}>Presente</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, flex: 1, background: value.vigente ? "#1a7a3a" : "#f0f0f0", border: value.vigente ? "2px solid #1a7a3a" : "0.5px solid #ccc", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
          <input type="checkbox" checked={value.vigente} onChange={e => onChange({ ...value, vigente: e.target.checked })} style={{ width: 20, height: 20 }} />
          <span style={{ color: value.vigente ? "#fff" : "#555" }}>Vigente</span>
        </label>
      </div>
      <label style={s.label}>Vencimiento</label>
      <input type="date" value={vto} onChange={e => onVto(e.target.value)} style={s.input} />
    </div>
  );
}

function NivelItem({ label, value, onChange }) {
  const opts = [
    { label: "A nivel", bg: "#1a7a3a" },
    { label: "Nivel alto", bg: "#e6a817" },
    { label: "Nivel bajo", bg: "#c0392b" },
  ];
  return (
    <div style={{ borderBottom: "0.5px solid #ddd", paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {opts.map(o => (
          <button key={o.label} onClick={() => onChange(o.label)} style={{ flex: 1, padding: "12px 4px", fontSize: 14, borderRadius: 10, border: value === o.label ? "2px solid " + o.bg : "1px solid #ccc", background: value === o.label ? o.bg : "#f0f0f0", color: value === o.label ? "#fff" : "#333", fontWeight: value === o.label ? 500 : 400 }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function SemaforoItem({ label, value, onChange }) {
  const opts = [
    { label: "Limpio", bg: "#1a7a3a" },
    { label: "Regular", bg: "#e6a817" },
    { label: "Sucio", bg: "#c0392b" },
  ];
  return (
    <div style={{ borderBottom: "0.5px solid #ddd", paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {opts.map(o => (
          <button key={o.label} onClick={() => onChange(o.label)} style={{ flex: 1, padding: "12px 4px", fontSize: 14, borderRadius: 10, border: value === o.label ? "2px solid " + o.bg : "1px solid #ccc", background: value === o.label ? o.bg : "#f0f0f0", color: value === o.label ? "#fff" : "#333", fontWeight: value === o.label ? 500 : 400 }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function CubiertasItem({ value, onChange }) {
  const opts = [
    { label: "Buenas", bg: "#1a7a3a" },
    { label: "Malas", bg: "#c0392b" },
    { label: "Muy malas", bg: "#7b0d0d" },
  ];
  return (
    <div style={{ borderBottom: "0.5px solid #ddd", paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Cubiertas</div>
      <div style={{ display: "flex", gap: 8 }}>
        {opts.map(o => (
          <button key={o.label} onClick={() => onChange(o.label)} style={{ flex: 1, padding: "12px 4px", fontSize: 15, borderRadius: 10, border: value === o.label ? "2px solid " + o.bg : "1px solid #ccc", background: value === o.label ? o.bg : "#f0f0f0", color: value === o.label ? "#fff" : "#333", fontWeight: value === o.label ? 500 : 400 }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

const initDocV = () => ({
  cedulaVerde: { presente: false, vigente: false },
  altaCNRT: { presente: false, vigente: false },
  dut: { presente: false, vigente: false },
  seguroAutomotor: { presente: false, vigente: false },
  botiquin: { presente: false, vigente: false },
  seguroInternacional: { presente: false, vigente: false },
  revisionTecnica: { presente: false, vigente: false },
  autorizManejo: { presente: false, vigente: false },
});

const docVLabels = {
  cedulaVerde: "Cédula verde", altaCNRT: "Alta CNRT - Nación", dut: "DUT",
  seguroAutomotor: "Seguro automotor", botiquin: "Botiquín",
  seguroInternacional: "Seguro internacional", revisionTecnica: "Revisión técnica vehicular",
  autorizManejo: "Autoriz. de manejo interno",
};

function ChoferModule() {
  const [etapa, setEtapa] = useState(1);
  const [interno, setInterno] = useState("");
  const [otroInterno, setOtroInterno] = useState("");
  const [f1, setF1] = useState({
    dia: "", hora: "", lugar: "", nroReserva: "", origen: "", destino: "", cliente: "", conductor: "", fondos: "",
    docV: initDocV(),
    carnetNac: { presente: false, vigente: false, vto: "" },
    libretaTrabajo: { presente: false, vigente: false, vto: "" },
    matafuego: { presente: false, vigente: false },
    checkpoint: { presente: false, vigente: false },
    antenaStarlink: { presente: false, vigente: false },
    dobleAuxilio: { presente: false, vigente: false },
    cadenas: { presente: false, vigente: false },
    aceiteMotor: "", refrigerante: "", liquidoFreno: "", cubiertas: "", limpieza: "",
    tanqueLleno: false, kmInicio: "",
  });
  const [f2, setF2] = useState({ kmFinal: "", cantPasajeros: "", observaciones: "" });
  const [saved, setSaved] = useState(false);
  const [meta, setMeta] = useState(null);

  const upF1 = (k, v) => setF1(p => ({ ...p, [k]: v }));
  const upDV = (k, v) => setF1(p => ({ ...p, docV: { ...p.docV, [k]: v } }));
  const upF2 = (k, v) => setF2(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[1, 2].map(e => (
          <button key={e} onClick={() => setEtapa(e)} style={{ flex: 1, padding: "12px", fontSize: 15, borderRadius: 10, border: etapa === e ? "2px solid " + (e === 1 ? "#8B1A2E" : "#1a5c8a") : "1px solid #ccc", background: etapa === e ? (e === 1 ? "#8B1A2E" : "#1a5c8a") : "#f0f0f0", color: etapa === e ? "#fff" : "#333", fontWeight: etapa === e ? 500 : 400 }}>
            {e === 1 ? "✈️ Antes de salir" : "🏁 Al regresar"}
          </button>
        ))}
      </div>

      {etapa === 1 && (
        <div>
          <div style={s.sectionTitle}>Datos del viaje</div>
          <Field label="Fecha" type="date" value={f1.dia} onChange={v => upF1("dia", v)} />
          <Field label="Hora" type="time" value={f1.hora} onChange={v => upF1("hora", v)} />
          <Field label="Lugar" value={f1.lugar} onChange={v => upF1("lugar", v)} />
          <Field label="N° de reserva" value={f1.nroReserva} onChange={v => upF1("nroReserva", v)} />
          <Field label="Origen" value={f1.origen} onChange={v => upF1("origen", v)} />
          <Field label="Destino" value={f1.destino} onChange={v => upF1("destino", v)} />
          <Field label="Cliente" value={f1.cliente} onChange={v => upF1("cliente", v)} />
          <Field label="Conductor" value={f1.conductor} onChange={v => upF1("conductor", v)} />
          <Field label="Fondos recibidos ($)" type="number" value={f1.fondos} onChange={v => upF1("fondos", v)} />
          <VehiculoSelect value={interno} onChange={setInterno} otroTexto={otroInterno} onOtroTexto={setOtroInterno} />

          <div style={s.sectionTitle}>Documentación del vehículo</div>
          {Object.entries(docVLabels).map(([k, l]) => (
            <CheckItem key={k} label={l} value={f1.docV[k]} onChange={v => upDV(k, v)} />
          ))}

          <div style={s.sectionTitle}>Documentación del conductor</div>
          <CheckItemConVto label="Carnet conducir nacional" value={f1.carnetNac} onChange={v => upF1("carnetNac", v)} vto={f1.carnetNac.vto} onVto={v => upF1("carnetNac", { ...f1.carnetNac, vto: v })} />
          <CheckItemConVto label="Libreta de trabajo" value={f1.libretaTrabajo} onChange={v => upF1("libretaTrabajo", v)} vto={f1.libretaTrabajo.vto} onVto={v => upF1("libretaTrabajo", { ...f1.libretaTrabajo, vto: v })} />

          <div style={s.sectionTitle}>Otros</div>
          <CheckItem label="Matafuego" value={f1.matafuego} onChange={v => upF1("matafuego", v)} />
          <CheckItem label="Check point" value={f1.checkpoint} onChange={v => upF1("checkpoint", v)} />
          <CheckItem label="Antena Starlink" value={f1.antenaStarlink} onChange={v => upF1("antenaStarlink", v)} />
          <CheckItem label="Doble auxilio" value={f1.dobleAuxilio} onChange={v => upF1("dobleAuxilio", v)} />
          <CheckItem label="Cadenas" value={f1.cadenas} onChange={v => upF1("cadenas", v)} />

          <div style={s.sectionTitle}>Estado del vehículo</div>
          <NivelItem label="Aceite motor" value={f1.aceiteMotor} onChange={v => upF1("aceiteMotor", v)} />
          <NivelItem label="Refrigerante" value={f1.refrigerante} onChange={v => upF1("refrigerante", v)} />
          <NivelItem label="Líquido de freno" value={f1.liquidoFreno} onChange={v => upF1("liquidoFreno", v)} />
          <CubiertasItem value={f1.cubiertas} onChange={v => upF1("cubiertas", v)} />
          <SemaforoItem label="Limpieza del vehículo" value={f1.limpieza} onChange={v => upF1("limpieza", v)} />

          <div style={s.sectionTitle}>Kilometraje de salida</div>
          <Field label="Km inicio" type="number" value={f1.kmInicio} onChange={v => upF1("kmInicio", v)} />
          <label style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, background: f1.tanqueLleno ? "#1a7a3a" : "#f0f0f0", border: f1.tanqueLleno ? "2px solid #1a7a3a" : "0.5px solid #ccc", borderRadius: 10, padding: "12px 14px", cursor: "pointer", marginBottom: 12 }}>
            <input type="checkbox" checked={f1.tanqueLleno} onChange={e => upF1("tanqueLleno", e.target.checked)} style={{ width: 22, height: 22 }} />
            <span style={{ color: f1.tanqueLleno ? "#fff" : "#333" }}>Tanque lleno</span>
          </label>

          <button onClick={async () => { const m = await capturarMeta(); setMeta(m); setEtapa(2); }} style={{ ...s.saveBtn, background: "#8B1A2E", color: "#fff" }}>
            Guardar y continuar al regreso →
          </button>
        </div>
      )}

      {etapa === 2 && (
        <div>
          <div style={s.sectionTitle}>Al regresar</div>
          <Field label="Km final" type="number" value={f2.kmFinal} onChange={v => upF2("kmFinal", v)} />
          <Field label="Cantidad de pasajeros" type="number" value={f2.cantPasajeros} onChange={v => upF2("cantPasajeros", v)} />
          <div>
            <label style={s.label}>Observaciones del viaje</label>
            <textarea value={f2.observaciones} onChange={e => upF2("observaciones", e.target.value)} rows={5} style={s.textarea} placeholder="Cualquier novedad del viaje..." />
          </div>
          <button onClick={async () => { const m = await capturarMeta(); setMeta(prev => ({ ...prev, horaRegreso: m.hora, latRegreso: m.lat, lngRegreso: m.lng })); setSaved(true); }} style={{ ...s.saveBtn, background: saved ? "#1a7a3a" : "#1a5c8a", color: "#fff" }}>
            {saved ? "✓ Registro completo guardado" : "Guardar registro completo"}
          </button>
        </div>
      )}
    </div>
  );
}

function LavadorModule() {
  const [horaEntrada, setHE] = useState("");
  const [horaSalida, setHS] = useState("");
  const [registros, setRegistros] = useState(
    FLOTA.map(v => ({ id: v.interno, interno: v.interno, patente: v.patente, lavado: false, observacion: "", externo: false }))
  );
  const [saved, setSaved] = useState(false);
  const [meta, setMeta] = useState(null);

  const upReg = (id, k, v) => setRegistros(r => r.map(x => x.id === id ? { ...x, [k]: v } : x));
  const addExterno = () => setRegistros(r => [...r, { id: "ext_" + Date.now(), interno: "", patente: "", lavado: false, observacion: "", externo: true }]);

  return (
    <div>
      <div style={s.sectionTitle}>Horario</div>
      <Field label="Hora de entrada" type="time" value={horaEntrada} onChange={setHE} />
      <Field label="Hora de salida" type="time" value={horaSalida} onChange={setHS} />

      <div style={s.sectionTitle}>Registro de lavado</div>
      {registros.map(r => (
        <div key={r.id} style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              {r.externo ? (
                <>
                  <input type="text" value={r.interno} onChange={e => upReg(r.id, "interno", e.target.value)} placeholder="Descripción del vehículo" style={{ ...s.input, marginBottom: 6 }} />
                  <input type="text" value={r.patente} onChange={e => upReg(r.id, "patente", e.target.value)} placeholder="Patente" style={{ ...s.input, marginBottom: 0 }} />
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 500, fontSize: 16 }}>Int {r.interno}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{r.patente}</div>
                </>
              )}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, background: r.lavado ? "#1a7a3a" : "#f0f0f0", border: r.lavado ? "2px solid #1a7a3a" : "1px solid #ccc", borderRadius: 10, padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={r.lavado} onChange={e => upReg(r.id, "lavado", e.target.checked)} style={{ width: 20, height: 20 }} />
              <span style={{ color: r.lavado ? "#fff" : "#333" }}>Lavado</span>
            </label>
          </div>
          <label style={s.label}>Observaciones</label>
          <textarea value={r.observacion} onChange={e => upReg(r.id, "observacion", e.target.value)} rows={2} style={s.textarea} placeholder="Roturas, rayaduras, novedades..." />
        </div>
      ))}
      <button onClick={addExterno} style={s.addBtn}>+ Agregar vehículo externo</button>
      <button onClick={async () => { const m = await capturarMeta(); setMeta(m); setSaved(true); }} style={{ ...s.saveBtn, background: saved ? "#1a7a3a" : "#8B1A2E", color: "#fff" }}>
        {saved ? "✓ Guardado" : "Guardar registro"}
      </button>
    </div>
  );
}

function MecanicoModule() {
  const [horaIngreso, setHI] = useState("");
  const [horaEgreso, setHE] = useState("");
  const [tareas, setTareas] = useState([{ id: 1, interno: "", otroInterno: "", dueno: "", descripcion: "", horas: "", repuestos: [{ id: 1, nombre: "", precio: "" }] }]);
  const [saved, setSaved] = useState(false);
  const [meta, setMeta] = useState(null);

  const addT = () => setTareas(t => [...t, { id: Date.now(), interno: "", otroInterno: "", dueno: "", descripcion: "", horas: "", repuestos: [{ id: 1, nombre: "", precio: "" }] }]);
  const remT = id => setTareas(t => t.filter(x => x.id !== id));
  const upT = (id, k, v) => setTareas(t => t.map(x => x.id === id ? { ...x, [k]: v } : x));
  const addR = tid => setTareas(t => t.map(x => x.id === tid ? { ...x, repuestos: [...x.repuestos, { id: Date.now(), nombre: "", precio: "" }] } : x));
  const remR = (tid, rid) => setTareas(t => t.map(x => x.id === tid ? { ...x, repuestos: x.repuestos.filter(r => r.id !== rid) } : x));
  const upR = (tid, rid, k, v) => setTareas(t => t.map(x => x.id === tid ? { ...x, repuestos: x.repuestos.map(r => r.id === rid ? { ...r, [k]: v } : r) } : x));

  return (
    <div>
      <div style={s.sectionTitle}>Horario</div>
      <Field label="Hora de ingreso" type="time" value={horaIngreso} onChange={setHI} />
      <Field label="Hora de egreso" type="time" value={horaEgreso} onChange={setHE} />

      <div style={s.sectionTitle}>Tareas del día</div>
      {tareas.map((t, i) => (
        <div key={t.id} style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>Tarea {i + 1}</span>
            {tareas.length > 1 && <button onClick={() => remT(t.id)} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, background: "#fee", border: "1px solid #fcc", color: "#c00" }}>Eliminar</button>}
          </div>
          <VehiculoSelect value={t.interno} onChange={v => upT(t.id, "interno", v)} otroTexto={t.otroInterno} onOtroTexto={v => upT(t.id, "otroInterno", v)} />
          <Field label="Pertenece a (cliente/empresa)" value={t.dueno} onChange={v => upT(t.id, "dueno", v)} />
          <div>
            <label style={s.label}>Descripción de la reparación/tarea</label>
            <textarea value={t.descripcion} onChange={e => upT(t.id, "descripcion", e.target.value)} rows={3} style={s.textarea} />
          </div>
          <Field label="Horas dedicadas" type="number" value={t.horas} onChange={v => upT(t.id, "horas", v)} />
          <div style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 8 }}>Repuestos utilizados</div>
          {t.repuestos.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #ddd", padding: "12px", marginBottom: 8 }}>
              <Field label="Repuesto" value={r.nombre} onChange={v => upR(t.id, r.id, "nombre", v)} placeholder="Descripción del repuesto" />
              <Field label="Precio ($)" type="number" value={r.precio} onChange={v => upR(t.id, r.id, "precio", v)} />
              {t.repuestos.length > 1 && <button onClick={() => remR(t.id, r.id)} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, background: "#fee", border: "1px solid #fcc", color: "#c00" }}>Eliminar repuesto</button>}
            </div>
          ))}
          <button onClick={() => addR(t.id)} style={{ ...s.addBtn, marginBottom: 0 }}>+ Agregar repuesto</button>
        </div>
      ))}
      <button onClick={addT} style={s.addBtn}>+ Agregar tarea</button>
      <button onClick={async () => { const m = await capturarMeta(); setMeta(m); setSaved(true); }} style={{ ...s.saveBtn, background: saved ? "#1a7a3a" : "#8B1A2E", color: "#fff" }}>
        {saved ? "✓ Guardado" : "Guardar registro"}
      </button>
    </div>
  );
}

function App() {
  const [active, setActive] = useState(null);
  const modules = [
    { id: "chofer", label: "Chofer", desc: "Registro pre-viaje y al regreso" },
    { id: "lavador", label: "Antonio — Lavador", desc: "Entrada, salida y lavado de vehículos" },
    { id: "mecanico", label: "Mecánico", desc: "Ingreso, egreso y tareas del día" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: "2rem" }}>
      <div style={{ background: "#8B1A2E", borderRadius: "0 0 16px 16px", padding: "16px 16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <img src="https://aynorte.com.ar/ievt/assets/agencias/aynorte/img/fw-18-logo-aynorte-blanco.png" alt="Aynorte" style={{ height: 48, objectFit: "contain" }} />
        <div style={{ flex: 1 }}>
          {active
            ? <div style={{ fontSize: 17, fontWeight: 500, color: "#fff" }}>{modules.find(m => m.id === active).label}</div>
            : <><div style={{ fontSize: 17, fontWeight: 500, color: "#fff" }}>Gestión de personal</div>
               <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Aynorte Travel</div></>
          }
        </div>
        {active && <button onClick={() => setActive(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13 }}>← Volver</button>}
      </div>

      <div style={{ padding: "0 12px" }}>
        {!active && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {modules.map(m => (
              <button key={m.id} onClick={() => setActive(m.id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 16px", textAlign: "left", borderRadius: 14, background: "#fff", border: "0.5px solid #ddd", width: "100%", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 17, color: "#111" }}>{m.label}</div>
                  <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>{m.desc}</div>
                </div>
                <span style={{ color: "#8B1A2E", fontSize: 20 }}>›</span>
              </button>
            ))}
          </div>
        )}
        {active === "chofer" && <ChoferModule />}
        {active === "lavador" && <LavadorModule />}
        {active === "mecanico" && <MecanicoModule />}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
