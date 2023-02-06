import React, { useState, useEffect } from "react";
import "./CountryListing.css";

function CountryListing() {
    const [countries, setCountries] = useState([]);
    const [sorted, setSorted] = useState({ field: "name", order: "asc" });
    const [filter, setFilter] = useState({
        area: null,
        region: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [countriesPerPage] = useState(20);
    const [areaFilter, setAreaFilter] = useState(null);

    useEffect(() => {
        fetch("https://restcountries.com/v2/all?fields=name,region,area")
            .then((res) => res.json())
            .then((data) => setCountries(data));
    }, []);

    const handleSort = (field) => {
        setSorted({
            ...sorted,
            field,
            order: sorted.order === "asc" ? "desc" : "asc",
        });
        setFilter({
            ...filter,
            region: field.target.value
        });
        setAreaFilter(field.target.value);
    };

    const filteredCountries = countries
    .filter((country) => {
        if (filter.area !== null && country.area > filter.area) {
            return false;
        }
        if (filter.region && country.region !== filter.region) {
            return false;
        }
        if (areaFilter !== null && country.area >= areaFilter) {
            return false;
        }
        return true;
    })
    .sort((a, b) => {
        if (sorted.order === "asc") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    const currentCountries = filteredCountries.slice(
        indexOfFirstCountry,
        indexOfLastCountry
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCountries.length / countriesPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map((number) => {
        return (
            <li
                key={number}
                className={number === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </li>
        );
    });

    return (
        <div>
            <h2>Country List</h2>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>Name</th>
                        <th onClick={() => handleSort("region")}>
                            Region
                            <select onChange={(e) => setFilter({ ...filter, region: e.target.value })}>
                                <option value="">All Regions</option>
                                <option value="Asia">Asia</option>
                                <option value="Americas">Americas</option>
                                <option value="Africa">Africa</option>
                                <option value="Europe">Europe</option>
                                <option value="Oceania">Oceania</option>
                                <option value="Polar">Polar</option>
                            </select>
                        </th>
                        <th onClick={() => handleSort("area")}>
                            Area
                            <select onChange={(e) => setFilter({ ...filter, area: e.target.value ? Number(e.target.value) : null })}>
                                <option value="">All</option>
                                <option value="65300">Smaller than Lithuania</option>
                            </select>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentCountries.map((country) => (
                        <tr key={country.name}>
                            <td>{country.name}</td>
                            <td>{country.region}</td>
                            <td>{country.area}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul className="pagination">{renderPageNumbers}</ul>
        </div>
    );
  }
export default CountryListing;