import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

type props = {
  setConformPostDelete: any,
  
}

const DeleteConform = ({ setConformPostDelete }: props) => {

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.UserLogin);

  const token = user?.token;

  const discard = () => {
    const obj = {
      "method": 'delete_post',
      "post_id": id,
      "user_id": user.data.user_id,
    }

    fetch(`${import.meta.env.VITE_API_URL}post`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        contentType: 'application/json',
        version: '1.0.0',
        token: `Bearer ${token}`,
      }, body: JSON.stringify(obj)
    }).then((res) => {
      res.json().then((response) => {
        if (response.status === 1) {
          navigate(-1);
        }

      })
    }).catch((e) => {
      // console.log('post Delete Error ...', e);

    })
  }

  const cancel = () => {
    // setDiscard(false);
    setConformPostDelete(false);
  }
  return (

    <div className="dis-main d-f" onClick={() => discard()}>
      <div className="dis-box">
        <div className="dis-text d-f">
          <span>  Discard post?</span>
          <span style={{ fontSize: '1.2rem' }}>  Do you Wan't to Delete Post.</span>
        </div>
        <div className="dis-discard d-f">
          <span style={{ color: 'red', fontSize: '1.5rem' }} onClick={() => discard()}>Discard</span>
        </div>
        <div className="dis-cancel d-f">
          <span style={{ fontSize: '1.5rem' }} onClick={() => cancel()}>Cancel</span>
        </div>
      </div>
    </div>
  )
}

export default DeleteConform