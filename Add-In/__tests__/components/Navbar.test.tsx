import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { faChartSimple, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../../src/components/Navbar';


jest.mock('../../src/components/list/CategoryList.tsx', () => () => <div>Category List Content</div>);

describe('Navbar', () => {
    it('renders Navbar component', () => {
        render(<Navbar />);
        expect(screen.getByLabelText('Navigation Bar')).toBeInTheDocument();
    });

    it('renders CategoryList when Home icon is clicked', () => {
        render(<Navbar />);
        const homeTab = screen.getByTestId('home-tab');
        expect(homeTab).toBeInTheDocument();
        fireEvent.click(homeTab);
        expect(screen.getByText(/category list content/i)).toBeInTheDocument();
    });

    it('renders Charts icon', () => {
        render(<Navbar />);
        const chartsIcon = screen.getByTestId('charts-tab');
        expect(chartsIcon).toBeInTheDocument();
        expect(chartsIcon).toContainHTML('<svg');
    });

    it('renders Settings icon', () => {
        render(<Navbar />);
        const settingsIcon = screen.getByTestId('settings-tab');
        expect(settingsIcon).toBeInTheDocument();
        expect(settingsIcon).toContainHTML('<svg');
    });
});