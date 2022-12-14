
import { Card,  FormControl,  InputLabel,  MenuItem,  Select, Typography } from "@mui/material";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBooks } from "../../store/bookSlice";

import MuiLoader from "../MuiLoader";

import { Link } from "react-router-dom";
import "./books.css";

import StarRatingAvg from "../Reviews/StarRatingAvg";
import AllProductsAdd from "../addToCart/AllProductsAdd"


const AllBooks = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const books = useSelector((state) => state.book.books);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSort,setSelectedSort] = useState('unsorted')
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/books");
      dispatch(setBooks(data));
    } catch (err) {
      console.log(err); //<- not sure if we want the err console logged but fine for dev purposes.
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  if (loading) return(
    <div
    className="loadingContainer">
      <MuiLoader/>
    </div>
  )
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value)
  }
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  // 'sortedBooks' is the sorted array that we loop over to allow the user to sort by what they want
  let sortedBooks = [...books]
  // switch case that sorts the array based on the selected sort
  const sortBooks = () => {
    switch(selectedSort){
      case 'ascending':
        sortedBooks.sort((a,b)=>(a.price > b.price) ? 1 : -1)
        break
        case "descending":
          sortedBooks.sort((a,b)=>(a.price < b.price) ? 1 : -1)
          break
          case "unsorted":
            sortedBooks = [...books]
            break
            case "a-z":
              sortedBooks.sort(function(a, b){
                if(a.title < b.title) { return -1; }
                if(a.title > b.title) { return 1; }
                return 0;
              })
              break
              case "z-a":
                sortedBooks.sort(function(a, b){
                  if(a.title > b.title) { return -1; }
                  if(a.title < b.title) { return 1; }
                  return 0;
                })
                break
              }
            }
            sortBooks()
            // PAGINATION
            const PER_PAGE = 12;
            const offset = currentPage * PER_PAGE;
            const currentPageData = sortedBooks
                .slice(offset, offset + PER_PAGE)
            const pageCount = Math.ceil(sortedBooks.length / PER_PAGE);
            //
            return (
    <div className="productsContainer">
      <h1>All Comics</h1>
      <div className="sortBar">
    <FormControl variant="filled" sx={{color: "black", m: 1, minWidth: 120 }} size="small">
    <InputLabel sx={{color:"black"}}>Sort</InputLabel>
    <Select
    onChange={handleSortChange}
    label="Sort"
    value={selectedSort}
    >
      <MenuItem value="unsorted">unsorted</MenuItem>
      <MenuItem value="ascending">Price: low to high</MenuItem>
      <MenuItem value="descending">Price: high to low</MenuItem>
      <MenuItem value="a-z">Title: A-Z</MenuItem>
      <MenuItem value="z-a">Title: Z-A</MenuItem>
    </Select>
    </FormControl>
      </div>
    <div className="allBooks">
      {currentPageData.map((book) => {
        return (
          <Card
          sx={{ boxShadow: 2 }}
          className="productCard"
          variant="outlined"
          key={book.id}>
            <div className="productCardImg">
              <Link to={`/books/${book.id}`}>
                <img src={book.imageURL} />
              </Link>
            </div>
            <div
            className="cardRatings"
            >
              <StarRatingAvg key={book.id} book={book} />
            </div>
            <div className="productCardButtons">
              <Typography>${(book.price / 100).toFixed(2)}</Typography>
            <AllProductsAdd book={book}/>
            </div>
          </Card>
        );
      })}
    <ReactPaginate
      previousLabel={"← Previous"}
      nextLabel={"Next →"}
      pageCount={pageCount}
      onPageChange={handlePageClick}
      containerClassName={"pagination"}
      previousLinkClassName={"pagination__link"}
      nextLinkClassName={"pagination__link"}
      disabledClassName={"pagination__link--disabled"}
      activeClassName={"pagination__link--active"}
    />
    </div>
    </div>
  );
};

export default AllBooks;
