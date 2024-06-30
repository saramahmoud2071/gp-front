import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import './BugReport.css';
import { POST } from '../utils/API';

export function BugReport() {
  const navigate = useNavigate();

  function bugReport() {
    const title = document.getElementById("bug-title").value;
    const description = document.getElementById("bug-description").value;
    console.log(title + " " + description);

    const report = {
      "title": title,
      "description": description
    }

    if(!checkFields(report, ['title', 'description']) ) {
      alert("Please, fill all fields");
      return;
    }
    console.log(report);

    POST("reportBug",report).then((response) => {
      console.log(response);
      toast(" Report sent successfully", { type: 'success' });
      document.getElementById("bug-title").value = "";
      document.getElementById("bug-description").value = "";
      navigate('/bug');
    })
    .catch((error) => {
      console.log(error);
      toast("Report wasn't sent", { type: 'error' });
    });
  }

  function checkFields(requestObject, fields) {
    return fields.every(k => (k in requestObject && requestObject[k] && requestObject[k].trim().length > 0))
  }

  return (
    <div className="bug-report">
      <div className="bug-card" style={{'background-color' : 'white'}}>
        <h2> Report a Bug </h2>
        <form className="bug">
          <textarea type="text" placeholder="Write a title..." className="bug-title" id="bug-title" style={{width : '100%', border: '1px solid #604d92', 'border-radius': '5px'}}/>
          <textarea placeholder="Write a description..." className="bug-description" id="bug-description" style={{width : '100%', border: '1px solid #604d92', 'border-radius': '5px'}}></textarea>
        </form>
        <div className="submit">
          <input type="submit" className="block-button-small" onClick={bugReport} />
        </div>
      </div>
    </div>
  );
}

