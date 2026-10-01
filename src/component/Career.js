const Career = ({ question, clarifier }) => {
    return (
        <div className="mb-6 md:mb-10">
            <h2 className="font-serif text-[30px] md:text-[38px] font-medium leading-[1.2] text-[#F5F1E8] mb-5">
                {question}
            </h2>
            {clarifier && (
                <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.6]">
                    {clarifier}
                </p>
            )}
        </div>
    );
}

export default Career;
