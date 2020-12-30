export const FETCH_PROFILE = 'FETCH_PROFILE';
export const EDIT_PROFILE = 'EDIT_PROFILE';

const baseUrl = "http://192.168.1.100:8000/";


export const fetchProfile = ()=>{
    return async (dispatch,getState)=>{
        let token = getState().auth.token;
        const response = await fetch(
            baseUrl + 'portal/patient-details/',{
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Token ${token}`
                }
            }
        );

        if(!response.ok){
            throw new Error("Something went wrong!")
        }

        const jsonResponse = await response.json();
        dispatch({
            type : FETCH_PROFILE,
            profileData : jsonResponse.data
        })
    }
}

export const editProfile = (profileData)=>{
    return async (dispatch,getState)=>{
        let token = getState().auth.token;
        const response = await fetch(
            baseUrl + 'portal/patient-details/',{
                method : 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                  'first_name': profileData.first_name,
                  'last_name': profileData.last_name,
                  'contact': profileData.contact,
                  'email': profileData.email,
                  'birthday': profileData.birthday,
                  'weight' : profileData.weight
                })
            }
        );

        if(!response.ok){
            throw new Error("Something went wrong!")
        }

        dispatch({
            type : EDIT_PROFILE,
            profileData : profileData
        })
    }
}