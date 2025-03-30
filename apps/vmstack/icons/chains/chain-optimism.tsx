const ChainOptimism = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-testid="geist-icon"
    height={size || 32}
    strokeLinejoin="round"
    width={size || 32}
    style={{ color: "currentcolor" }}
    className={className}
    viewBox="0 0 34 34"
    focusable="false"
  >
    <path
      d="M17 34C26.3888 34 34 26.3888 34 17C34 7.61116 26.3888 0 17 0C7.61116 0 0 7.61116 0 17C0 26.3888 7.61116 34 17 34Z"
      fill="#FF0420"
    />
    <path
      d="M12.3295 21.76C11.3042 21.76 10.4641 21.5131 9.80918 21.0195C9.16298 20.5171 8.83984 19.8031 8.83984 18.8775C8.83984 18.6836 8.8614 18.4456 8.90444 18.1635C9.01651 17.5289 9.1759 16.7664 9.38269 15.8761C9.96858 13.452 11.4808 12.24 13.9193 12.24C14.5828 12.24 15.1773 12.3546 15.7029 12.5838C16.2285 12.8041 16.6421 13.1391 16.9437 13.5886C17.2453 14.0294 17.3961 14.5583 17.3961 15.1753C17.3961 15.3604 17.3745 15.594 17.3314 15.8761C17.2022 16.6606 17.0471 17.4231 16.8662 18.1635C16.5646 19.3711 16.0433 20.2747 15.3022 20.8741C14.5612 21.4647 13.5703 21.76 12.3295 21.76ZM12.5105 19.856C12.993 19.856 13.4023 19.7105 13.7384 19.4196C14.083 19.1288 14.3286 18.6836 14.4751 18.0842C14.6732 17.2556 14.824 16.5328 14.9274 15.9158C14.9619 15.7306 14.9791 15.5411 14.9791 15.3472C14.9791 14.5451 14.5699 14.144 13.7513 14.144C13.2688 14.144 12.8552 14.2894 12.5105 14.5803C12.1744 14.8712 11.9332 15.3164 11.7867 15.9158C11.6316 16.5064 11.4765 17.2291 11.3214 18.0842C11.287 18.2605 11.2697 18.4456 11.2697 18.6395C11.2697 19.4505 11.6833 19.856 12.5105 19.856Z"
      fill="white"
    />
    <path
      d="M17.9895 21.6278C17.8947 21.6278 17.8215 21.597 17.7698 21.5352C17.7267 21.4647 17.7138 21.3854 17.731 21.2972L19.5146 12.7028C19.5318 12.6059 19.5792 12.5265 19.6568 12.4648C19.7344 12.4031 19.8162 12.3722 19.9024 12.3722H23.3404C24.2968 12.3722 25.0636 12.575 25.641 12.9805C26.2269 13.386 26.5199 13.9721 26.5199 14.739C26.5199 14.9594 26.494 15.1886 26.4423 15.4266C26.2269 16.4403 25.7918 17.1895 25.1369 17.6744C24.4907 18.1592 23.6031 18.4016 22.4744 18.4016H20.7295L20.135 21.2972C20.1178 21.3942 20.0704 21.4735 19.9928 21.5352C19.9153 21.597 19.8334 21.6278 19.7473 21.6278H17.9895ZM22.5648 16.5769C22.9267 16.5769 23.2412 16.4755 23.5084 16.2728C23.7841 16.0701 23.965 15.7792 24.0513 15.4001C24.0771 15.2503 24.09 15.1181 24.09 15.0035C24.09 14.7479 24.0168 14.5539 23.8703 14.4217C23.7238 14.2806 23.4739 14.2101 23.1206 14.2101H21.5697L21.0785 16.5769H22.5648Z"
      fill="white"
    />
  </svg>
);

export default ChainOptimism;
