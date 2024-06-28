import styled from 'styled-components'

export const ConvictContainer = styled.div`
  margin: 42px auto 0;
  /* max-width: 1100px; */
  width: 90%;



  
`


export const ConvictDetailsContainer=styled.section `

margin-top: 2rem;
padding-bottom: 10rem;

background: ${props=> props.theme.white};

  header {
    padding: 2rem 6rem;
    background: ${props=> props.theme['gray-100']};

    button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;

      &:hover{
        color: ${props=> props.theme['green-300']};
        transition: 0.2s;
      }
    }
  }

`


export const ProfileInfo= styled.div`

margin-top: 5rem;
display: flex;
gap: 2rem;
padding-inline: 5rem;

img {

  width: 12rem;
  height: 12rem;
  border-radius: 9999px;
  border: 4px solid ${props=> props.theme['green-300']};;
}

h1 {
  font-size: 4rem;
  color: ${props=> props.theme['green-300']};
}

  span {
    &:first-child {
      background: #e0e0e0;
      width: 8rem;
      height: 8rem;
      border-radius: 50%;
      padding: 1rem;
      font-weight: bold;
      margin-left: 1rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
  }
`




export const StatusAndRelevanceContainer= styled.div`
  margin-top: 2rem;
  padding-inline: 5rem;
  display: flex;
  justify-content: space-between;
 
  p{
    color: ${props=> props.theme['gray-300']};
  }

  p > span {
    color: ${props=> props.theme['green-100']};
  }

`


export const Relevance= styled.div`
 display: flex;
  justify-content: center;
  align-items: center;
  height: max-content;

 border: 8px solid ${props=> props.theme['gray-100']};
 border-radius: 8px;

 span {
  color: ${props=> props.theme.white};
  padding: 0.4rem .6rem;
 }

 span:nth-child(1) {
  background: ${props=> props.theme['green-100']};
 }
 span:nth-child(2) {
  background: ${props=> props.theme['yellow-200']};
 }
 span:nth-child(3) {
  background: ${props=> props.theme['red-300']};
 }
`



export const ImposedMeasureContainer= styled.div`
margin-inline: 5rem;
margin-top: 2rem;
background: ${props=> props.theme.white};
color: ${props=> props.theme['gray-300']};;
box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    header {
    padding: 2rem 2rem;
    background: #EFEFEF;
    
    h3 {
      color: ${props=> props.theme['green-300']};
    }
  }

  p {
    padding: 2rem;
  }

`
export const CrimesContainer= styled.div`
margin-inline: 5rem;
margin-top: 2rem;
background: ${props=> props.theme.white};
color: ${props=> props.theme['gray-300']};;
box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    header {
    padding: 2rem 2rem;
    background: #EFEFEF;
    
    h3 {
      color: ${props=> props.theme['green-300']};
    }
  }

  ul {
    padding: 2rem;
    list-style: circle;
    margin-left: 2rem;
  }

`
export const VisitsObsContainer= styled.div`
margin-inline: 5rem;
margin-top: 2rem;
background: ${props=> props.theme.white};
color: ${props=> props.theme['gray-300']};;
box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    header {
    padding: 2rem 2rem;
    background: #EFEFEF;
    
    h3 {
      color: ${props=> props.theme['green-300']};
    }
  }

  ul {
    padding: 2rem;
    list-style: circle;
    margin-left: 2rem;
  }


`