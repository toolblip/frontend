export default function PillsRow({ toolCount }: { toolCount: number }) {
  return (
    <div className="tb-v2-container">
      <div className="tb-v2-pills">
        <span className="tb-v2-pill"><b>{toolCount}</b> tools in the drawer</span>
        <span className="tb-v2-pill"><b>0</b> accounts needed</span>
        <span className="tb-v2-pill"><b>0kb</b> uploaded to our servers</span>
        <span className="tb-v2-pill"><b>∞</b> times you can use them</span>
        <span className="tb-v2-pill"><b>100%</b> free, always</span>
      </div>
    </div>
  );
}
