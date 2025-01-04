import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setSelectedMarathon } from "../../redux/marathonsSlice";
import MarathonType from "../../components/Marathons/MarathonsType";

// Типизация для данных марафона и стадий
interface Marathon {
  title: string;
  stages: Stage[];
}

interface Stage {
  name: string;
  details: Detail[];
}

interface Detail {
  name: string;
}

interface RootState {
  marathons: {
    marathons: Marathon[];
    selectedMarathon: string | null;
  };
}

const Marathons: React.FC = () => {
  const dispatch = useDispatch();
  const { marathons, selectedMarathon } = useSelector(
    (state: RootState) => state.marathons
  );
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  // Обработчики кликов
  const handleMarathonClick = (title: string): void => {
    dispatch(setSelectedMarathon(title));
  };

  const handleBackClick = (): void => {
    dispatch(setSelectedMarathon(null));
  };

  const handleDetailClick = (stageName: string, detailName: string): void => {
    setOpenDetails(
      openDetails === `${stageName}-${detailName}`
        ? null
        : `${stageName}-${detailName}`
    );
  };

  // Формирование контента
  const content = selectedMarathon
    ? marathons
        .filter((marathon) => marathon.title === selectedMarathon)
        .map((marathon) =>
          marathon.stages.map((stage, stageIndex) => (
            <motion.div
              key={stageIndex}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <MarathonType
                title={stage.name}
                stages={stage.details.map((detail) => (
                  <div key={detail.name}>
                    <p
                      className="cursor-pointer text-gray-600 hover:text-gray-800 transition"
                      onClick={() => handleDetailClick(stage.name, detail.name)}
                    >
                      {detail.name}
                    </p>
                    {openDetails === `${stage.name}-${detail.name}` && (
                      <div className="mt-2 pl-4 text-gray-500">
                        <p>Дополнительная информация о {detail.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              />
            </motion.div>
          ))
        )
    : marathons.map((marathon, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <MarathonType
            title={
              <motion.h2
                className="text-xl font-semibold text-gray-700 cursor-pointer"
                whileHover={{
                  borderBottom: "3px solid #FCB72B",
                  color: "#FCB72B",
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleMarathonClick(marathon.title)}
              >
                {marathon.title}
              </motion.h2>
            }
            stages={marathon.stages.map((stage) => stage.name)}
          />
        </motion.div>
      ));

  return (
    <div className="container mx-auto p-8">
      <div className="w-full mb-8">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          {selectedMarathon ? selectedMarathon : "Marathons"}
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-6">{content}</div>

      {selectedMarathon && (
        <div className="text-center mt-8">
          <button
            className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-600 transition"
            onClick={handleBackClick}
          >
            Back to Marathons
          </button>
        </div>
      )}
    </div>
  );
};

export default Marathons;