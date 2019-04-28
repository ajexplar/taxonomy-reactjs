import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

import './App.css';

const TABLE_HEADERS = ['Name', 'Species', 'Genus', 'Family', 'Order', 'Class', 'Phylum', 'Habitat', 'Conservation Status']

const ASCENDING = 'asc';
const DESCENDING = 'dsc';

class AnimalRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : props.data.name,
            species: props.data.species,
            genus: props.data.genus,
            family: props.data.family,
            b_order: props.data.order,
            b_class: props.data.bclass,
            phylum: props.data.phylum,
            habitat: props.data.habitat,
            conservation: props.data.conservation
        };

        this.determineConservationStatus = this.determineConservationStatus.bind(this);
    }
    determineConservationStatus(abbreviation) {
        switch (abbreviation) {
            case 'EX': return 'Extinct';
            case 'EW': return 'Extinct-in-the-wild';
            case 'CR': return 'Critically endagered';
            case 'EN': return 'Endangered';
            case 'VU': return 'Vulnerable';
            case 'NT': return 'Near-threatened';
            case 'LC': return 'Least concern';
            case 'DD': return 'Insufficient data';
            default: return 'Not evaluated';
        }
    }
    render() {
        let conStat = this.determineConservationStatus(this.state.conservation);
        return(
            <tr>
                <td>{this.state.name}</td>
                <td>{this.state.species}</td>
                <td>{this.state.genus}</td>
                <td>{this.state.family}</td>
                <td>{this.state.b_order}</td>
                <td>{this.state.b_class}</td>
                <td>{this.state.phylum}</td>
                <td>{this.state.habitat}</td>
                <td>{conStat}</td>
            </tr>
        );
    }
}

class AnimalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            data: [],
            sort_by: 'name',
            ordering: 'dsc',
            filtering: {}
        };
        this.sortTable = this.sortTable.bind(this);
        this.updateFilterText = this.updateFilterText.bind(this);
        this.filterRows = this.filterRows.bind(this);
        this.convertHeader = this.convertHeader.bind(this);
    }
    componentDidMount() {
        this.setState({
            headers: TABLE_HEADERS
        });
    }
    componentWillReceiveProps(nextProps) {
        let all_animals = [];
        for (let a of nextProps.animals) {
            all_animals.push(a);
        }
        this.setState({
            data: all_animals
        });
    }
    sortTable(event, col) {
        let sData = this.state.data;
        if (!!sData) {
            let ord = (col !== this.state.sort_by) ? DESCENDING : (this.state.ordering === ASCENDING ? DESCENDING : ASCENDING);

            if (col !== this.state.sort_by || ord !== this.state.ordering) {
                if (ord == DESCENDING) {
                    sData.sort(
                        (a, b) => {
                            return a[col].localeCompare(b[col], { sensitivity: "base" });
                        }
                    );
                } else {
                    sData.sort(
                        (a, b) => {
                            return a[col].localeCompare(b[col], { sensitivity: "base" });
                        }
                    ).reverse();
                }
            }
            this.setState({
                data: sData,
                ordering: ord,
                sort_by: col 
            });
        }
    }
    updateFilterText(event, col) {
        let filterVal = Object.assign(this.state.filtering, { [col] : event.target.value });
        this.setState({
            filtering: filterVal 
        });
    }
    filterRows(row) {
        console.log(row);
        console.log(this.state.filtering);
        for (let property in this.state.filtering) {
            if(this.state.filtering.hasOwnProperty(property) && this.state.filtering[property].length > 0) {
                let cmp = row[property].includes(this.state.filtering[property]);
                if (!cmp) {
                    return false;
                }
            }
        }
        return row;
    }
    convertHeader(headerName) {
        switch (headerName) {
            case 'Class': return 'bclass';
            case 'Conservation Status': return 'conservation';
            default: return headerName.toLowerCase();
        }
    }
    render() {
        let headerList = this.state.headers.map((item, i) => {
            let arrow = (this.state.ordering) === ASCENDING ? String.fromCharCode(8593) : String.fromCharCode(8595);
            let kval = this.convertHeader(item);
            return <th key={kval} onClick={e => this.sortTable(e, kval)}>{item} {arrow}</th>;
        });

        let animalList = this.state.data.filter( (item, i) => {
            return this.filterRows(item);
        }).map( (item, i) => {
            return <AnimalRow key={item.id} data={item}/>;
        });

        let filterText = this.state.headers.map((item, i) => {
            let kval = this.convertHeader(item);
            let val = (this.state.filtering.hasOwnProperty(kval)) ? this.state.filtering[kval] :  ''
            return <th key={kval+' filter'}><span><input className='filterText' onChange={e => this.updateFilterText(e, kval)} value={val} /></span></th>
        });

        return (
            <table id='animalTable'>
                <thead>
                    <tr>{headerList}</tr>
                    <tr>{filterText}</tr>
                </thead>
                <tbody>
                {animalList}
                </tbody>
            </table>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
        }
        this.saveData = this.saveData.bind(this);
    }
    componentWillMount() {
        fetch('/api/animals')
            .then( (res) => res.json())
            .then( (db) => this.setState({data: JSON.parse(db)}));
    }
    saveData() {
        fetch('/api/exporter')
            .then( (res) => res.blob())
            .then( (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'animalia.csv');

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
    }
    render() {
        return (
            <div className='App'>
                <h1>Learn the Taxonomy of the Animal Kingdom</h1>
                <button id='csvSaver' onClick={this.saveData}>Download Table as CSV</button>
                <AnimalTable animals={this.state.data}/>
            </div>
        );
    }
}

export default hot(module)(App);
