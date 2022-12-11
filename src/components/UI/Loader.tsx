import { Oval } from "react-loader-spinner"

const Loading = () => {
  return (
    <Oval
      ariaLabel="loading-indicator"
      height={100}
      width={100}
      strokeWidth={1}
      strokeWidthSecondary={5}
      color="#1976d2"
      secondaryColor="transparent"
      wrapperStyle={{margin: 'auto'}}
    />
  )
}

export default Loading