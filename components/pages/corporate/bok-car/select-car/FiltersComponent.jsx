import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SearchInput from 'components/global/SearchInput';
import { Spinner, CustomRadio } from 'components/UI';

const FiltersComponent = ({
  title,
  loading,
  data,
  filterKey,
  gridFilter,
  fetchFromFilter,
  ...props
}) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAll, setViewAll] = useState(false);

  // Memoized version of handleSearch to prevent unnecessary re-creations
  const handleSearch = useCallback((value) => setSearchQuery(value), []);

  const mappedData = Object.entries(data || {});

  const handleViewAllClick = () => setViewAll((prevViewAll) => !prevViewAll);

  const filteredData = mappedData.filter(
    (obj) => obj[1].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 border rounded-xl shadow-md mb-4 mr-7" >
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg">{title}</span>
        <button className="text-primary" onClick={handleViewAllClick}>
          {viewAll ? t('view_less_key') : t('view_all_key')}
        </button>
      </div>

      {props.searchable && (
        <SearchInput searchText={searchQuery} handleSearch={(e) => handleSearch(e.target.value)} />
      )}

      {loading && !filteredData.length ? (
        <p className="text-center h-24">
          <Spinner className="w-8 h-8" />
        </p>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <p className="text-center">{t('no_matching_items_key')}</p>
          ) : (
            <ul>
              {filteredData.slice(0, viewAll ? filteredData.length : 5).map((item) => {
                const [itemId, itemName] = item;
                const isActiveCity = gridFilter[filterKey] === itemName;

                return (
                  <CustomRadio
                    key={itemId}
                    id={itemId}
                    name={filterKey}
                    label={itemName}
                    checked={isActiveCity}
                    onClick={() => {
                      if (isActiveCity) {
                        fetchFromFilter({ [filterKey]: null });
                        return;
                      }
                      fetchFromFilter({ [filterKey]: itemName });
                    }}
                  />
                );
              })}
            </ul>
          )}
          {filteredData.length > 0 && (
            <p
              className="hover:text-primary text-end cursor-pointer"
              onClick={() => {
                fetchFromFilter({ [filterKey]: null });
                handleSearch('');
              }}
            >
              {t('reset_key')}
            </p>
          )}
        </>
      )}

      {mappedData.length === 0 && !loading && <p>{t('table_no_data_message_key')}</p>}
    </div>
  );
};

FiltersComponent.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  filterKey: PropTypes.string.isRequired,
  gridFilter: PropTypes.shape({
    city: PropTypes.string,
    // Add other gridFilter props if they are present in the actual data
  }).isRequired,
  fetchFromFilter: PropTypes.func.isRequired,
  searchable: PropTypes.bool, // If this prop is passed, the SearchInput will be displayed
};

export default FiltersComponent;
