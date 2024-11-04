import "./css/Diff.css"

export const Diff = () => {
  return (
    <div className="radio-container">
      <input checked id="radio-free" name="radio" type="radio" />
      <label htmlFor="radio-free">Free</label>
      <input id="radio-basic" name="radio" type="radio" />
      <label htmlFor="radio-basic">Basic</label>
      <input id="radio-premium" name="radio" type="radio" />
      <label htmlFor="radio-premium">Premium</label>

      <div className="glider-container">
        <div className="glider"></div>
      </div>
    </div>
  );
}
