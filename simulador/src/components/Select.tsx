function Select(){
    return <div className="form-floating">
    <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
    <label htmlFor="floatingSelect">Works with selects</label>
  </div>
}

export default Select;
